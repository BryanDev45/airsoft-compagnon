
CREATE OR REPLACE FUNCTION public.create_team_with_leader(
  team_name TEXT,
  team_description TEXT,
  team_is_association BOOLEAN,
  team_contact TEXT,
  team_location TEXT
)
RETURNS uuid -- returns the new team_id
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_team_id UUID;
  leader_user_id UUID;
  default_logo TEXT := '/placeholder.svg';
  default_banner TEXT := 'https://images.unsplash.com/photo-1553302948-2b3ec6d9eada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=300&q=80';
BEGIN
  -- Get the user id of the person calling the function
  leader_user_id := auth.uid();
  
  IF leader_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create a team';
  END IF;

  -- Insert the new team and set the leader
  INSERT INTO public.teams (name, description, is_association, contact, location, leader_id, member_count, logo, banner)
  VALUES (
    team_name,
    COALESCE(team_description, ''),
    COALESCE(team_is_association, false),
    COALESCE(team_contact, ''),
    COALESCE(team_location, ''),
    leader_user_id,
    1, -- Start with 1 member
    default_logo,
    default_banner
  )
  RETURNING id INTO new_team_id;

  -- Add the leader as the first member of the team with 'Admin' role
  INSERT INTO public.team_members (team_id, user_id, role, status)
  VALUES (new_team_id, leader_user_id, 'Admin', 'confirmed');

  RETURN new_team_id;
END;
$$;
