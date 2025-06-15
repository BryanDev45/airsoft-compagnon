
-- 1. Insérer le nouveau badge s'il n'existe pas
INSERT INTO public.badges (name, description, icon, background_color, border_color)
SELECT
  'Membre d''équipe',
  'Fait partie d''une équipe.',
  '/lovable-uploads/2537f58d-1e88-417d-af4a-86212ad60901.png',
  '#e6f7ff',
  '#91d5ff'
WHERE NOT EXISTS (
  SELECT 1 FROM public.badges WHERE name = 'Membre d''équipe'
);

-- 2. Créer la fonction de déclencheur pour gérer l'attribution du badge
CREATE OR REPLACE FUNCTION public.manage_team_member_badge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  team_member_badge_id UUID;
BEGIN
  SELECT id INTO team_member_badge_id FROM badges WHERE name = 'Membre d''équipe' LIMIT 1;

  IF team_member_badge_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Attribuer le badge si l'utilisateur rejoint ou change d'équipe
  IF NEW.team_id IS NOT NULL AND (OLD.team_id IS NULL OR OLD.team_id != NEW.team_id) THEN
    INSERT INTO user_badges (user_id, badge_id, date)
    VALUES (NEW.id, team_member_badge_id, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  -- Retirer le badge si l'utilisateur quitte une équipe
  ELSIF NEW.team_id IS NULL AND OLD.team_id IS NOT NULL THEN
    DELETE FROM user_badges
    WHERE user_id = NEW.id AND badge_id = team_member_badge_id;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3. Créer le déclencheur sur la table des profils s'il n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_profile_team_change'
    ) THEN
        CREATE TRIGGER on_profile_team_change
        AFTER UPDATE OF team_id ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.manage_team_member_badge();
    END IF;
END
$$;

-- 4. Mettre à jour les badges pour les membres d'équipe existants
DO $$
DECLARE
  team_member_badge_id UUID;
BEGIN
  SELECT id INTO team_member_badge_id FROM public.badges WHERE name = 'Membre d''équipe' LIMIT 1;

  IF team_member_badge_id IS NOT NULL THEN
    -- Attribuer le badge aux utilisateurs actuellement dans une équipe qui ne l'ont pas
    INSERT INTO public.user_badges (user_id, badge_id, date)
    SELECT p.id, team_member_badge_id, NOW()
    FROM public.profiles p
    WHERE p.team_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_badges ub
      WHERE ub.user_id = p.id AND ub.badge_id = team_member_badge_id
    );

    -- Retirer le badge des utilisateurs qui l'ont mais ne sont plus dans une équipe
    DELETE FROM public.user_badges
    WHERE badge_id = team_member_badge_id
    AND user_id IN (
      SELECT id FROM public.profiles WHERE team_id IS NULL
    );
  END IF;
END $$;
