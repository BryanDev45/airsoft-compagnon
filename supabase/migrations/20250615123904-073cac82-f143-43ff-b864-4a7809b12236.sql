
-- First, ensure the 'Chef d'équipe' badge exists
INSERT INTO public.badges (name, description, icon, background_color, border_color)
SELECT
  'Chef d''équipe',
  'Désigne le leader d''une équipe.',
  '/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png', -- Using verified badge icon as placeholder
  '#fffbe6',
  '#ffe58f'
WHERE NOT EXISTS (
  SELECT 1 FROM public.badges WHERE name = 'Chef d''équipe'
);


-- Then, backfill the badge for existing team leaders who don't have it.
-- This is a one-time operation.
DO $$
DECLARE
  team_leader_badge_id UUID;
BEGIN
  -- Get the ID of the 'Chef d'équipe' badge
  SELECT id INTO team_leader_badge_id FROM public.badges WHERE name = 'Chef d''équipe' LIMIT 1;
  
  -- If the badge exists, grant it to current team leaders
  IF team_leader_badge_id IS NOT NULL THEN
    INSERT INTO public.user_badges (user_id, badge_id, date)
    SELECT p.id, team_leader_badge_id, NOW()
    FROM public.profiles p
    WHERE p.is_team_leader = true
    AND NOT EXISTS (
      SELECT 1 FROM public.user_badges ub
      WHERE ub.user_id = p.id AND ub.badge_id = team_leader_badge_id
    );
  END IF;
END $$;


-- Create the trigger to automate badge assignment in the future if it doesn't exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_profile_team_leader_change'
    ) THEN
        CREATE TRIGGER on_profile_team_leader_change
        AFTER UPDATE OF is_team_leader ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.manage_team_leader_badge();
    END IF;
END
$$;
