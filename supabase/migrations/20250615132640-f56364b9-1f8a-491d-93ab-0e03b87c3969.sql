
-- Table pour stocker les avertissements des utilisateurs
CREATE TABLE public.user_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warned_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  context TEXT, -- Pour stocker des informations contextuelles, comme l'ID du rapport lié
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE public.user_warnings ENABLE ROW LEVEL SECURITY;

-- Définir les politiques de sécurité
-- Seuls les administrateurs peuvent gérer les avertissements
CREATE POLICY "Admins can manage user warnings"
  ON public.user_warnings
  FOR ALL
  USING (is_current_user_admin())
  WITH CHECK (is_current_user_admin());

-- Fonction pour créer une notification lors d'un nouvel avertissement
CREATE OR REPLACE FUNCTION public.create_user_warning_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  VALUES (
    NEW.warned_user_id,
    'Avertissement reçu',
    'Vous avez reçu un avertissement d''un administrateur. Raison : ' || NEW.reason,
    'user_warning',
    NEW.id
  );
  RETURN NEW;
END;
$function$
;

-- Déclencheur pour exécuter la fonction après l'insertion d'un avertissement
CREATE TRIGGER on_user_warning_created
  AFTER INSERT ON public.user_warnings
  FOR EACH ROW
  EXECUTE PROCEDURE public.create_user_warning_notification();

