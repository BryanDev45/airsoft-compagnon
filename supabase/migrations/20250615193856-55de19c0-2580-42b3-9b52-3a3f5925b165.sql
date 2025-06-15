
-- Met à jour la fonction de création d'équipe pour y inclure la création de conversation
CREATE OR REPLACE FUNCTION public.create_team_with_leader(
  team_name TEXT,
  team_description TEXT,
  team_is_association BOOLEAN,
  team_contact TEXT,
  team_location TEXT
)
RETURNS uuid
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
  leader_user_id := auth.uid();
  
  IF leader_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create a team';
  END IF;

  -- Créer l'équipe
  INSERT INTO public.teams (name, description, is_association, contact, location, leader_id, member_count, logo, banner)
  VALUES (team_name, COALESCE(team_description, ''), COALESCE(team_is_association, false), COALESCE(team_contact, ''), COALESCE(team_location, ''), leader_user_id, 1, default_logo, default_banner)
  RETURNING id INTO new_team_id;

  -- Créer la conversation d'équipe
  INSERT INTO public.conversations (type, name, team_id)
  VALUES ('team', 'Équipe ' || team_name, new_team_id);
  
  -- Ajouter le leader comme membre confirmé.
  -- Cela déclenchera le trigger pour l'ajouter à la conversation.
  INSERT INTO public.team_members (team_id, user_id, role, status)
  VALUES (new_team_id, leader_user_id, 'Admin', 'confirmed');

  RETURN new_team_id;
END;
$$;


-- Crée une fonction pour gérer les ajouts/suppressions de membres dans les conversations d'équipe
CREATE OR REPLACE FUNCTION public.handle_team_membership_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id UUID;
  v_team_id UUID;
  v_user_id UUID;
BEGIN
  -- Lors d'une insertion (nouveau membre)
  IF (TG_OP = 'INSERT') THEN
    IF NEW.status = 'confirmed' THEN
      v_team_id := NEW.team_id;
      v_user_id := NEW.user_id;
      SELECT id INTO v_conversation_id FROM conversations WHERE team_id = v_team_id AND type = 'team';
      IF v_conversation_id IS NOT NULL THEN
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (v_conversation_id, v_user_id)
        ON CONFLICT (conversation_id, user_id) DO NOTHING;
      END IF;
    END IF;
  
  -- Lors d'une mise à jour (changement de statut)
  ELSIF (TG_OP = 'UPDATE') THEN
    v_team_id := NEW.team_id;
    v_user_id := NEW.user_id;
    -- Si un membre devient confirmé
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
      SELECT id INTO v_conversation_id FROM conversations WHERE team_id = v_team_id AND type = 'team';
      IF v_conversation_id IS NOT NULL THEN
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (v_conversation_id, v_user_id)
        ON CONFLICT (conversation_id, user_id) DO NOTHING;
      END IF;
    -- Si un membre n'est plus confirmé
    ELSIF NEW.status != 'confirmed' AND OLD.status = 'confirmed' THEN
      SELECT id INTO v_conversation_id FROM conversations WHERE team_id = v_team_id AND type = 'team';
      IF v_conversation_id IS NOT NULL THEN
        DELETE FROM conversation_participants
        WHERE conversation_id = v_conversation_id AND user_id = v_user_id;
      END IF;
    END IF;

  -- Lors d'une suppression (départ/exclusion d'un membre)
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.status = 'confirmed' THEN
      v_team_id := OLD.team_id;
      v_user_id := OLD.user_id;
      SELECT id INTO v_conversation_id FROM conversations WHERE team_id = v_team_id AND type = 'team';
      IF v_conversation_id IS NOT NULL THEN
        DELETE FROM conversation_participants
        WHERE conversation_id = v_conversation_id AND user_id = v_user_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$;


-- Crée un déclencheur (trigger) sur la table des membres d'équipe
DROP TRIGGER IF EXISTS on_team_membership_change ON public.team_members;

CREATE TRIGGER on_team_membership_change
AFTER INSERT OR UPDATE OR DELETE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.handle_team_membership_changes();
