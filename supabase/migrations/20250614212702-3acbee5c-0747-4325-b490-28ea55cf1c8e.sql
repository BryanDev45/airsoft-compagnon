
-- Modifier la fonction trigger pour inclure l'instruction de resoumission dans le message de rejet
CREATE OR REPLACE FUNCTION public.create_verification_approval_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_username TEXT;
BEGIN
  -- Pour les changements de statut vers 'approved'
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    -- Récupérer le nom d'utilisateur
    SELECT username INTO user_username
    FROM profiles WHERE id = NEW.user_id;
    
    -- Créer la notification d'approbation
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.user_id,
      'Compte vérifié !',
      'Félicitations ! Votre demande de vérification de compte a été approuvée. Votre compte est maintenant vérifié.',
      'verification_approved',
      NEW.id
    );
  END IF;
  
  -- Pour les changements de statut vers 'rejected'
  IF OLD.status != 'rejected' AND NEW.status = 'rejected' THEN
    -- Récupérer le nom d'utilisateur
    SELECT username INTO user_username
    FROM profiles WHERE id = NEW.user_id;
    
    -- Créer la notification de rejet avec la raison et les instructions
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.user_id,
      'Demande de vérification refusée',
      CASE 
        WHEN NEW.admin_notes IS NOT NULL AND NEW.admin_notes != '' 
        THEN 'Votre demande de vérification a été refusée. Raison : ' || NEW.admin_notes || '. Une fois les problèmes corrigés, vous pouvez soumettre une nouvelle demande de vérification depuis votre profil.'
        ELSE 'Votre demande de vérification a été refusée. Veuillez contacter un administrateur pour plus d''informations. Une fois les problèmes corrigés, vous pouvez soumettre une nouvelle demande de vérification depuis votre profil.'
      END,
      'verification_rejected',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;
