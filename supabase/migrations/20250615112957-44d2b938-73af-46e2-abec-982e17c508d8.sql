
-- Add the association_role column to the team_members table
ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS association_role TEXT;
