
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
    default_avatars TEXT[];
    random_avatar_index INTEGER;
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
    
    -- Assigner un avatar par défaut aléatoire
    default_avatars := ARRAY[
        '/lovable-uploads/dc20bd05-193b-4100-bf42-cfbbb20433ad.png',
        '/lovable-uploads/dbca34c0-4c90-48de-b573-3ee4118da4d1.png',
        '/lovable-uploads/b4ffe288-3017-4672-a679-cb442d6f00e0.png',
        '/lovable-uploads/79637843-91ff-413e-80fc-ac24713183c3.png',
        '/lovable-uploads/52a37106-d8af-4a71-9d67-4d69bd884c8f.png',
        '/lovable-uploads/49b5c95b-338d-461a-a797-2eef2ab61a57.png'
    ];
    random_avatar_index := floor(random() * array_length(default_avatars, 1) + 1)::INTEGER;
    avatar_url := default_avatars[random_avatar_index];
    
    -- Créer le profil avec les valeurs par défaut
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
    
    -- Créer les statistiques de l'utilisateur
    INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$function$;
