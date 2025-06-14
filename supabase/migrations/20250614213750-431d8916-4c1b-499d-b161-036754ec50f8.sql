
-- Fonction pour vérifier et bannir automatiquement les utilisateurs avec une mauvaise réputation
CREATE OR REPLACE FUNCTION public.check_and_ban_low_reputation_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    rating_count INTEGER;
    avg_rating NUMERIC;
    current_user_id UUID;
BEGIN
    -- Compter le nombre de notations pour cet utilisateur
    SELECT COUNT(*) INTO rating_count
    FROM public.user_ratings
    WHERE rated_id = p_user_id;
    
    -- Si l'utilisateur a plus de 20 notations
    IF rating_count > 20 THEN
        -- Calculer la moyenne des notations
        SELECT AVG(rating) INTO avg_rating
        FROM public.user_ratings
        WHERE rated_id = p_user_id;
        
        -- Si la moyenne est inférieure à 2/5
        IF avg_rating < 2.0 THEN
            -- Vérifier si l'utilisateur n'est pas déjà banni
            IF NOT EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = p_user_id AND Ban = true
            ) THEN
                -- Bannir automatiquement l'utilisateur
                UPDATE public.profiles
                SET 
                    Ban = true,
                    ban_reason = 'Bannissement automatique : Réputation trop faible (moyenne de ' || ROUND(avg_rating, 2) || '/5 sur ' || rating_count || ' notations)',
                    ban_date = NOW(),
                    banned_by = '00000000-0000-0000-0000-000000000000'::uuid -- ID système pour les bannissements automatiques
                WHERE id = p_user_id;
                
                -- Créer une notification pour informer l'utilisateur
                INSERT INTO public.notifications (user_id, title, message, type)
                VALUES (
                    p_user_id,
                    'Compte suspendu',
                    'Votre compte a été automatiquement suspendu en raison d''une réputation trop faible. Contactez un administrateur pour plus d''informations.',
                    'account_banned'
                );
            END IF;
        END IF;
    END IF;
END;
$$;

-- Modifier la fonction update_user_reputation pour inclure la vérification de bannissement
CREATE OR REPLACE FUNCTION public.update_user_reputation(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    -- Calculate average rating
    SELECT AVG(rating) INTO avg_rating
    FROM public.user_ratings
    WHERE rated_id = p_user_id;
    
    -- Update profile reputation
    UPDATE public.profiles
    SET reputation = COALESCE(avg_rating, 0)
    WHERE id = p_user_id;
    
    -- Vérifier et potentiellement bannir l'utilisateur
    PERFORM check_and_ban_low_reputation_user(p_user_id);
END;
$$;
