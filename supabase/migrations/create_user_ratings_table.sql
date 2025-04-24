
-- Create the user_ratings table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID REFERENCES auth.users NOT NULL,
  rated_id UUID REFERENCES auth.users NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(rater_id, rated_id)
);

-- Add RLS policies for the user_ratings table
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select all ratings
CREATE POLICY "Anyone can view user ratings" ON public.user_ratings
  FOR SELECT USING (true);

-- Policy to allow users to insert their own ratings
CREATE POLICY "Users can insert their own ratings" ON public.user_ratings
  FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Policy to allow users to update their own ratings
CREATE POLICY "Users can update their own ratings" ON public.user_ratings
  FOR UPDATE USING (auth.uid() = rater_id);

-- Trigger to update the profiles.reputation column
CREATE OR REPLACE FUNCTION public.update_user_reputation()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  -- Calculate the average rating for the rated user
  SELECT AVG(rating) INTO avg_rating
  FROM public.user_ratings
  WHERE rated_id = NEW.rated_id;
  
  -- Update the user's reputation in the profiles table
  UPDATE public.profiles
  SET reputation = avg_rating
  WHERE id = NEW.rated_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to update reputation when ratings change
DROP TRIGGER IF EXISTS update_reputation_on_rating ON public.user_ratings;
CREATE TRIGGER update_reputation_on_rating
AFTER INSERT OR UPDATE ON public.user_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_user_reputation();
