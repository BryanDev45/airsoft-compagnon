
-- Helper function to check if a user is an admin of a team
CREATE OR REPLACE FUNCTION public.is_team_admin(p_team_id uuid, p_user_id uuid)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.teams t
        WHERE t.id = p_team_id AND t.leader_id = p_user_id
    )
    OR EXISTS (
        SELECT 1
        FROM public.team_members tm
        WHERE tm.team_id = p_team_id AND tm.user_id = p_user_id AND tm.role = 'Admin' AND tm.status = 'confirmed'
    )
    INTO is_admin;
    
    RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create team_news table
CREATE TABLE public.team_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add check constraint for images array length
ALTER TABLE public.team_news ADD CONSTRAINT images_max_10_items CHECK (COALESCE(cardinality(images), 0) <= 10);

-- Enable RLS on team_news
ALTER TABLE public.team_news ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_news
CREATE POLICY "Public can read team news"
ON public.team_news
FOR SELECT
USING (true);

CREATE POLICY "Team admins can insert team news"
ON public.team_news
FOR INSERT
WITH CHECK (public.is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can update their team news"
ON public.team_news
FOR UPDATE
USING (public.is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can delete their team news"
ON public.team_news
FOR DELETE
USING (public.is_team_admin(team_id, auth.uid()));

-- Create storage bucket for team news images
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-news-images', 'team-news-images', true);

-- RLS Policies for storage bucket
CREATE POLICY "Team news images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-news-images');

CREATE POLICY "Authenticated users can upload team news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-news-images');

CREATE POLICY "Image owner can update image"
ON storage.objects FOR UPDATE
USING (auth.uid() = owner);

CREATE POLICY "Image owner can delete image"
ON storage.objects FOR DELETE
USING (auth.uid() = owner);
