
-- Supprimer l'ancienne fonction qui pose problème
DROP FUNCTION IF EXISTS public.get_game_with_participants(uuid);

-- Créer une nouvelle fonction optimisée qui fonctionne correctement
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
  SELECT COALESCE(json_agg(
    json_build_object(
      'id', gp.id,
      'user_id', gp.user_id,
      'game_id', gp.game_id,
      'status', gp.status,
      'role', gp.role,
      'created_at', gp.created_at,
      'profile', CASE 
        WHEN p.id IS NOT NULL THEN json_build_object(
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
  ), '[]'::jsonb)::jsonb INTO participants_array
  FROM game_participants gp
  LEFT JOIN profiles p ON p.id = gp.user_id
  WHERE gp.game_id = p_game_id;
  
  -- Récupérer le profil du créateur
  SELECT to_jsonb(p.*) INTO creator_data
  FROM profiles p
  WHERE p.id = game_record.created_by;
  
  -- Retourner les résultats
  RETURN QUERY SELECT 
    to_jsonb(game_record)::jsonb as game_data,
    participants_array as participants,
    creator_data as creator_profile;
END;
$$;
