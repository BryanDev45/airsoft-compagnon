
-- Créer une table pour suivre le statut en ligne des utilisateurs
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Activer Row Level Security
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir le statut de tous les autres utilisateurs
CREATE POLICY "Users can view all presence status" 
  ON public.user_presence 
  FOR SELECT 
  USING (true);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre statut
CREATE POLICY "Users can update their own presence" 
  ON public.user_presence 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer leur propre statut
CREATE POLICY "Users can insert their own presence" 
  ON public.user_presence 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour mettre à jour le statut utilisateur
CREATE OR REPLACE FUNCTION public.update_user_presence(p_user_id UUID, p_is_online BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, is_online, last_seen, updated_at)
  VALUES (p_user_id, p_is_online, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_online = p_is_online,
    last_seen = now(),
    updated_at = now();
END;
$$;

-- Fonction pour vérifier si un utilisateur est en ligne (considéré en ligne si actif dans les 5 dernières minutes)
CREATE OR REPLACE FUNCTION public.is_user_online(p_user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_is_online BOOLEAN := false;
  v_last_seen TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT is_online, last_seen 
  INTO v_is_online, v_last_seen
  FROM public.user_presence 
  WHERE user_id = p_user_id;
  
  -- Si aucun enregistrement trouvé, l'utilisateur est considéré comme hors ligne
  IF v_last_seen IS NULL THEN
    RETURN false;
  END IF;
  
  -- Considérer en ligne si le statut est true ET last_seen est dans les 5 dernières minutes
  RETURN v_is_online AND v_last_seen > (now() - interval '5 minutes');
END;
$$;

-- Activer les mises à jour en temps réel pour la table user_presence
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
