
-- Function to update the average rating of a team
CREATE OR REPLACE FUNCTION public.update_team_average_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_team_id UUID;
    avg_rating NUMERIC;
BEGIN
    -- Determine the team_id from the operation
    IF (TG_OP = 'DELETE') THEN
        v_team_id := OLD.team_id;
    ELSE
        v_team_id := NEW.team_id;
    END IF;

    -- Calculate the new average rating
    SELECT AVG(tr.rating)
    INTO avg_rating
    FROM public.team_ratings tr
    WHERE tr.team_id = v_team_id;

    -- Update the team's average rating
    UPDATE public.teams
    SET rating = COALESCE(avg_rating, 0)
    WHERE id = v_team_id;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$;

-- Drop existing trigger if it exists to avoid errors on re-run
DROP TRIGGER IF EXISTS on_team_rating_change ON public.team_ratings;

-- Trigger to call the function after a change in team_ratings
CREATE TRIGGER on_team_rating_change
AFTER INSERT OR UPDATE OR DELETE ON public.team_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_team_average_rating();

-- RLS for teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all teams" ON public.teams;
CREATE POLICY "Public can view all teams"
ON public.teams FOR SELECT
USING (true);

-- RLS for team_ratings table
ALTER TABLE public.team_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all team ratings" ON public.team_ratings;
CREATE POLICY "Public can view all team ratings"
ON public.team_ratings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert ratings" ON public.team_ratings;
CREATE POLICY "Authenticated users can insert ratings"
ON public.team_ratings FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  NOT EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_ratings.team_id AND tm.user_id = auth.uid() AND tm.status = 'confirmed'
  )
);

DROP POLICY IF EXISTS "Users can update their own ratings" ON public.team_ratings;
CREATE POLICY "Users can update their own ratings"
ON public.team_ratings FOR UPDATE
USING (auth.uid() = rater_id)
WITH CHECK (auth.uid() = rater_id);

DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.team_ratings;
CREATE POLICY "Users can delete their own ratings"
ON public.team_ratings FOR DELETE
USING (auth.uid() = rater_id);
