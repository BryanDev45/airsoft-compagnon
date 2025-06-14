
-- Créer une table pour suivre les messages lus par chaque utilisateur
CREATE TABLE public.message_read_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Activer RLS sur cette table
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne puissent voir que leurs propres statuts de lecture
CREATE POLICY "Users can view their own read status" 
  ON public.message_read_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent marquer leurs propres messages comme lus
CREATE POLICY "Users can mark messages as read" 
  ON public.message_read_status 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent mettre à jour leurs propres statuts de lecture
CREATE POLICY "Users can update their own read status" 
  ON public.message_read_status 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Créer un index pour optimiser les performances
CREATE INDEX idx_message_read_status_message_user ON public.message_read_status(message_id, user_id);
CREATE INDEX idx_message_read_status_user_read_at ON public.message_read_status(user_id, read_at);

-- Fonction pour marquer un message comme lu
CREATE OR REPLACE FUNCTION public.mark_message_as_read(p_message_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insérer ou mettre à jour le statut de lecture
  INSERT INTO public.message_read_status (message_id, user_id, read_at)
  VALUES (p_message_id, p_user_id, now())
  ON CONFLICT (message_id, user_id) 
  DO UPDATE SET read_at = now();
END;
$$;

-- Fonction pour marquer tous les messages d'une conversation comme lus
CREATE OR REPLACE FUNCTION public.mark_conversation_messages_as_read(p_conversation_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Marquer tous les messages de la conversation comme lus
  INSERT INTO public.message_read_status (message_id, user_id, read_at)
  SELECT m.id, p_user_id, now()
  FROM public.messages m
  WHERE m.conversation_id = p_conversation_id
    AND m.sender_id != p_user_id  -- Ne pas marquer ses propres messages
    AND NOT EXISTS (
      SELECT 1 FROM public.message_read_status mrs 
      WHERE mrs.message_id = m.id AND mrs.user_id = p_user_id
    )
  ON CONFLICT (message_id, user_id) 
  DO UPDATE SET read_at = now();
  
  -- Mettre à jour aussi last_read_at dans conversation_participants
  UPDATE public.conversation_participants
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id AND user_id = p_user_id;
END;
$$;

-- Fonction pour compter les messages non lus d'une conversation
CREATE OR REPLACE FUNCTION public.count_unread_messages(p_conversation_id UUID, p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM public.messages m
  WHERE m.conversation_id = p_conversation_id
    AND m.sender_id != p_user_id
    AND m.is_deleted = false
    AND NOT EXISTS (
      SELECT 1 FROM public.message_read_status mrs 
      WHERE mrs.message_id = m.id AND mrs.user_id = p_user_id
    );
    
  RETURN COALESCE(unread_count, 0);
END;
$$;
