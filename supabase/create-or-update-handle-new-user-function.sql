
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    calculated_age INTEGER;
    avatar_url TEXT;
BEGIN
    -- Calcul de l'âge si la date de naissance est disponible
    IF (NEW.raw_user_meta_data->>'birth_date') IS NOT NULL THEN
        calculated_age := DATE_PART('year', AGE(CURRENT_DATE, (NEW.raw_user_meta_data->>'birth_date')::date));
    ELSE
        calculated_age := NULL;
    END IF;
    
    -- Récupération de l'avatar aléatoire depuis les métadonnées
    avatar_url := NEW.raw_user_meta_data->>'avatar';
    
    -- Create profile with secure defaults if data is missing
    INSERT INTO public.profiles (
        id, 
        username, 
        email, 
        firstname,
        lastname,
        birth_date,
        age,
        join_date,
        avatar
    )
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || left(NEW.id::text, 8)),
        NEW.email,
        NEW.raw_user_meta_data->>'firstname',
        NEW.raw_user_meta_data->>'lastname',
        (CASE WHEN (NEW.raw_user_meta_data->>'birth_date') IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'birth_date')::date 
            ELSE NULL 
        END),
        calculated_age,
        CURRENT_DATE,
        avatar_url
    );
    
    -- Create user stats
    INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$function$;

-- S'assurer que le trigger existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END
$$;
