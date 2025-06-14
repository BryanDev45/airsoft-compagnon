
-- Créer une fonction trigger pour envoyer une notification lors de l'approbation d'une demande de vérification
CREATE OR REPLACE FUNCTION public.create_verification_approval_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_username TEXT;
BEGIN
  -- Seulement pour les changements de statut vers 'approved'
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    -- Récupérer le nom d'utilisateur
    SELECT username INTO user_username
    FROM profiles WHERE id = NEW.user_id;
    
    -- Créer la notification
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.user_id,
      'Compte vérifié !',
      'Félicitations ! Votre demande de vérification de compte a été approuvée. Votre compte est maintenant vérifié.',
      'verification_approved',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Créer le trigger pour les demandes de vérification
DROP TRIGGER IF EXISTS verification_approval_notification_trigger ON verification_requests;
CREATE TRIGGER verification_approval_notification_trigger
  AFTER UPDATE ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_verification_approval_notification();
