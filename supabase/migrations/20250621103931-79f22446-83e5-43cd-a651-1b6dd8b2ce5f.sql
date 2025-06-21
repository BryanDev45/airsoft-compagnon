
-- Drop existing policies if they exist and recreate them
-- This ensures we have the correct policies for search functionality

-- Drop existing policies on profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Enable RLS on teams table and create policies
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Team leaders can update their team" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;

-- Create policies for teams table
CREATE POLICY "Teams are viewable by everyone" 
  ON public.teams 
  FOR SELECT 
  USING (true);

CREATE POLICY "Team leaders can update their team" 
  ON public.teams 
  FOR UPDATE 
  USING (auth.uid() = leader_id);

CREATE POLICY "Authenticated users can create teams" 
  ON public.teams 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS on team_members table and create policies
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Users can manage their own team memberships" ON public.team_members;

-- Create policies for team_members table
CREATE POLICY "Team members are viewable by everyone" 
  ON public.team_members 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own team memberships" 
  ON public.team_members 
  FOR ALL 
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT leader_id FROM teams WHERE id = team_id
  ));

-- Enable RLS on user_stats table and create policies
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "User stats are viewable by everyone" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;

-- Create policies for user_stats table
CREATE POLICY "User stats are viewable by everyone" 
  ON public.user_stats 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own stats" 
  ON public.user_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
  ON public.user_stats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
