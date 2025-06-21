
-- Corriger la fonction get_game_with_participants pour qu'elle retourne les bonnes données
DROP FUNCTION IF EXISTS public.get_game_with_participants(uuid);

CREATE OR REPLACE FUNCTION public.get_game_with_participants(p_game_id uuid)
RETURNS TABLE(
  game_data jsonb,
  participants jsonb,
  creator_profile jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  game_record RECORD;
  participants_array jsonb := '[]'::jsonb;
  creator_data jsonb := 'null'::jsonb;
BEGIN
  -- Récupérer les données du jeu
  SELECT * INTO game_record
  FROM airsoft_games
  WHERE id = p_game_id;
  
  -- Si le jeu n'existe pas, retourner null
  IF NOT FOUND THEN
    RETURN QUERY SELECT null::jsonb, '[]'::jsonb, null::jsonb;
    RETURN;
  END IF;
  
  -- Récupérer les participants avec leurs profils
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', gp.id,
      'user_id', gp.user_id,
      'game_id', gp.game_id,
      'status', gp.status,
      'role', gp.role,
      'created_at', gp.created_at,
      'profile', CASE 
        WHEN p.id IS NOT NULL THEN jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'firstname', p.firstname,
          'lastname', p.lastname,
          'avatar', p.avatar,
          'is_verified', p.is_verified,
          'reputation', p.reputation
        )
        ELSE null
      END
    )
  ), '[]'::jsonb) INTO participants_array
  FROM game_participants gp
  LEFT JOIN profiles p ON p.id = gp.user_id
  WHERE gp.game_id = p_game_id;
  
  -- Récupérer le profil du créateur
  SELECT jsonb_build_object(
    'id', p.id,
    'username', p.username,
    'email', p.email,
    'firstname', p.firstname,
    'lastname', p.lastname,
    'birth_date', p.birth_date,
    'age', p.age,
    'join_date', p.join_date,
    'avatar', p.avatar,
    'banner', p.banner,
    'bio', p.bio,
    'location', p.location,
    'phone_number', p.phone_number,
    'team', p.team,
    'team_id', p.team_id,
    'is_team_leader', p.is_team_leader,
    'is_verified', p.is_verified,
    'newsletter_subscribed', p.newsletter_subscribed,
    'Admin', p."Admin",
    'Ban', p."Ban",
    'ban_date', p.ban_date,
    'ban_reason', p.ban_reason,
    'banned_by', p.banned_by,
    'reputation', p.reputation,
    'friends_list_public', p.friends_list_public,
    'spoken_language', p.spoken_language
  ) INTO creator_data
  FROM profiles p
  WHERE p.id = game_record.created_by;
  
  -- Retourner les résultats
  RETURN QUERY SELECT 
    to_jsonb(game_record)::jsonb as game_data,
    participants_array as participants,
    creator_data as creator_profile;
END;
$$;

-- Ajouter des coordonnées par défaut pour les parties qui n'en ont pas
UPDATE airsoft_games 
SET 
  latitude = 46.603354,  -- Centre de la France
  longitude = 1.8883335
WHERE latitude IS NULL OR longitude IS NULL OR latitude = 0 OR longitude = 0;
