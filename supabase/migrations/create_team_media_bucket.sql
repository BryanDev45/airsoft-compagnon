
-- Create storage bucket for team media
INSERT INTO storage.buckets (id, name, public)
VALUES ('team_media', 'Team Media', true);

-- Create policy to allow authenticated users to upload to this bucket
CREATE POLICY "Allow authenticated users to upload team media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team_media');

-- Create policy to allow all users to view team media
CREATE POLICY "Allow all users to view team media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'team_media');

-- Create policy to allow users to update their own uploads
CREATE POLICY "Allow users to update their own team media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'team_media');

-- Create policy to allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own team media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'team_media');

-- Create user_ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID REFERENCES auth.users(id) NOT NULL,
  rated_id UUID REFERENCES auth.users(id) NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (rater_id, rated_id)
);

-- Create functions to handle user ratings
CREATE OR REPLACE FUNCTION get_user_rating(p_rater_id UUID, p_rated_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_rating NUMERIC;
BEGIN
  SELECT rating INTO v_rating
  FROM user_ratings
  WHERE rater_id = p_rater_id AND rated_id = p_rated_id;
  
  RETURN v_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION insert_user_rating(p_rater_id UUID, p_rated_id UUID, p_rating NUMERIC)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_ratings (rater_id, rated_id, rating)
  VALUES (p_rater_id, p_rated_id, p_rating);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_user_rating(p_rater_id UUID, p_rated_id UUID, p_rating NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE user_ratings
  SET rating = p_rating, updated_at = now()
  WHERE rater_id = p_rater_id AND rated_id = p_rated_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
