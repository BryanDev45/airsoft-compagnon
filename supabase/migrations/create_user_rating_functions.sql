
-- Function to get user rating
CREATE OR REPLACE FUNCTION public.get_user_rating(p_rater_id UUID, p_rated_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_rating NUMERIC;
BEGIN
    SELECT rating INTO v_rating
    FROM public.user_ratings
    WHERE rater_id = p_rater_id AND rated_id = p_rated_id;
    
    RETURN v_rating;
END;
$$;

-- Function to insert user rating
CREATE OR REPLACE FUNCTION public.insert_user_rating(p_rater_id UUID, p_rated_id UUID, p_rating NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_ratings (rater_id, rated_id, rating)
    VALUES (p_rater_id, p_rated_id, p_rating);
    
    -- Update reputation in profile
    PERFORM update_user_reputation(p_rated_id);
END;
$$;

-- Function to update user rating
CREATE OR REPLACE FUNCTION public.update_user_rating(p_rater_id UUID, p_rated_id UUID, p_rating NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.user_ratings
    SET rating = p_rating, updated_at = NOW()
    WHERE rater_id = p_rater_id AND rated_id = p_rated_id;
    
    -- Update reputation in profile
    PERFORM update_user_reputation(p_rated_id);
END;
$$;

-- Function to get average rating
CREATE OR REPLACE FUNCTION public.get_average_rating(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT AVG(rating) INTO avg_rating
    FROM public.user_ratings
    WHERE rated_id = p_user_id;
    
    RETURN avg_rating;
END;
$$;

-- Function to update user reputation
CREATE OR REPLACE FUNCTION public.update_user_reputation(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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
END;
$$;
