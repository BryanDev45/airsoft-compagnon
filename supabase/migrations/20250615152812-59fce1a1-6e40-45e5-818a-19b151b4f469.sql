
CREATE OR REPLACE FUNCTION public.update_user_games_stats_securely(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    v_games_organized INTEGER;
    v_games_played INTEGER;
BEGIN
    -- Calculate the number of organized games
    SELECT COUNT(*)
    INTO v_games_organized
    FROM public.airsoft_games
    WHERE created_by = p_user_id;

    -- Calculate the total number of games played (participations)
    SELECT COUNT(*)
    INTO v_games_played
    FROM public.game_participants
    WHERE user_id = p_user_id AND status = 'Confirmé';

    -- Update the user_stats table
    INSERT INTO public.user_stats (user_id, games_organized, games_played, updated_at)
    VALUES (p_user_id, v_games_organized, v_games_played, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        games_organized = v_games_organized,
        games_played = v_games_played,
        updated_at = NOW();
END;
$$;
