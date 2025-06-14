
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    calculated_age INTEGER;
    avatar_url TEXT;
    user_name TEXT;
    first_name TEXT;
    last_name TEXT;
    email_username TEXT;
BEGIN
    -- Récupération des données depuis les métadonnées ou depuis l'email
    -- Support pour Google et Facebook
    first_name := COALESCE(
        NEW.raw_user_meta_data->>'first_name', 
        NEW.raw_user_meta_data->>'given_name',
        NEW.raw_user_meta_data->>'name'
    );
    last_name := COALESCE(
        NEW.raw_user_meta_data->>'last_name', 
        NEW.raw_user_meta_data->>'family_name'
    );
    
    -- Si Facebook ne fournit qu'un nom complet, essayer de le diviser
    IF first_name IS NULL AND (NEW.raw_user_meta_data->>'name') IS NOT NULL THEN
        first_name := SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1);
        last_name := SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 2);
    END IF;
    
    -- Génération du nom d'utilisateur
    IF (NEW.raw_user_meta_data->>'username') IS NOT NULL THEN
        user_name := NEW.raw_user_meta_data->>'username';
    ELSIF first_name IS NOT NULL AND last_name IS NOT NULL THEN
        user_name := LOWER(first_name || '.' || last_name);
    ELSIF NEW.email IS NOT NULL THEN
        email_username := SPLIT_PART(NEW.email, '@', 1);
        user_name := email_username;
    ELSE
        user_name := 'user_' || left(NEW.id::text, 8);
    END IF;
    
    -- S'assurer que le nom d'utilisateur est unique
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = user_name) LOOP
        user_name := user_name || '_' || floor(random() * 1000)::text;
    END LOOP;
    
    -- Calcul de l'âge si la date de naissance est disponible
    IF (NEW.raw_user_meta_data->>'birth_date') IS NOT NULL THEN
        calculated_age := DATE_PART('year', AGE(CURRENT_DATE, (NEW.raw_user_meta_data->>'birth_date')::date));
    ELSE
        calculated_age := NULL;
    END IF;
    
    -- Récupération de l'avatar (Google fournit picture, Facebook fournit picture aussi)
    avatar_url := COALESCE(
        NEW.raw_user_meta_data->>'picture',
        NEW.raw_user_meta_data->>'avatar',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
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
        user_name,
        NEW.email,
        first_name,
        last_name,
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
