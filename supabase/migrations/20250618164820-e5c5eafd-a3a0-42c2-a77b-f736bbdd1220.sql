
-- Insérer le badge "freelance" s'il n'existe pas
INSERT INTO public.badges (name, description, icon, background_color, border_color)
SELECT
  'Freelance',
  'Joueur indépendant sans équipe.',
  '/lovable-uploads/146443fc-6946-476d-b189-b53c17e48f0a.png',
  '#f0f9ff',
  '#0ea5e9'
WHERE NOT EXISTS (
  SELECT 1 FROM public.badges WHERE name = 'Freelance'
);

-- Mettre à jour la fonction pour gérer les badges "freelance" et "membre d'équipe"
CREATE OR REPLACE FUNCTION public.manage_team_member_badge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  team_member_badge_id UUID;
  freelance_badge_id UUID;
BEGIN
  -- Récupérer les IDs des badges
  SELECT id INTO team_member_badge_id FROM badges WHERE name = 'Membre d''équipe' LIMIT 1;
  SELECT id INTO freelance_badge_id FROM badges WHERE name = 'Freelance' LIMIT 1;

  IF team_member_badge_id IS NULL OR freelance_badge_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Si l'utilisateur rejoint ou change d'équipe
  IF NEW.team_id IS NOT NULL AND (OLD.team_id IS NULL OR OLD.team_id != NEW.team_id) THEN
    -- Ajouter le badge "membre d'équipe"
    INSERT INTO user_badges (user_id, badge_id, date)
    VALUES (NEW.id, team_member_badge_id, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING;
    
    -- Retirer le badge "freelance"
    DELETE FROM user_badges
    WHERE user_id = NEW.id AND badge_id = freelance_badge_id;
    
  -- Si l'utilisateur quitte une équipe
  ELSIF NEW.team_id IS NULL AND OLD.team_id IS NOT NULL THEN
    -- Retirer le badge "membre d'équipe"
    DELETE FROM user_badges
    WHERE user_id = NEW.id AND badge_id = team_member_badge_id;
    
    -- Ajouter le badge "freelance"
    INSERT INTO user_badges (user_id, badge_id, date)
    VALUES (NEW.id, freelance_badge_id, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Mettre à jour les badges pour tous les utilisateurs existants
DO $$
DECLARE
  team_member_badge_id UUID;
  freelance_badge_id UUID;
BEGIN
  -- Récupérer les IDs des badges
  SELECT id INTO team_member_badge_id FROM public.badges WHERE name = 'Membre d''équipe' LIMIT 1;
  SELECT id INTO freelance_badge_id FROM public.badges WHERE name = 'Freelance' LIMIT 1;

  IF team_member_badge_id IS NOT NULL AND freelance_badge_id IS NOT NULL THEN
    -- Attribuer le badge "membre d'équipe" aux utilisateurs dans une équipe qui ne l'ont pas
    INSERT INTO public.user_badges (user_id, badge_id, date)
    SELECT p.id, team_member_badge_id, NOW()
    FROM public.profiles p
    WHERE p.team_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_badges ub
      WHERE ub.user_id = p.id AND ub.badge_id = team_member_badge_id
    );

    -- Attribuer le badge "freelance" aux utilisateurs sans équipe qui ne l'ont pas
    INSERT INTO public.user_badges (user_id, badge_id, date)
    SELECT p.id, freelance_badge_id, NOW()
    FROM public.profiles p
    WHERE p.team_id IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_badges ub
      WHERE ub.user_id = p.id AND ub.badge_id = freelance_badge_id
    );

    -- Retirer le badge "freelance" des utilisateurs qui sont dans une équipe
    DELETE FROM public.user_badges
    WHERE badge_id = freelance_badge_id
    AND user_id IN (
      SELECT id FROM public.profiles WHERE team_id IS NOT NULL
    );

    -- Retirer le badge "membre d'équipe" des utilisateurs qui ne sont plus dans une équipe
    DELETE FROM public.user_badges
    WHERE badge_id = team_member_badge_id
    AND user_id IN (
      SELECT id FROM public.profiles WHERE team_id IS NULL
    );
  END IF;
END $$;
