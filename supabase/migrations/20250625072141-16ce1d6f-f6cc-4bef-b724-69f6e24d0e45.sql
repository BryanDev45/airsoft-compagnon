
-- ÉTAPE 1: Nettoyage des politiques RLS redondantes et conflictuelles

-- ======= TEAM_MEMBERS =======
-- Supprimer toutes les politiques existantes sur team_members
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Users can manage their own team memberships" ON public.team_members;
DROP POLICY IF EXISTS "Enable read access for own memberships" ON public.team_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.team_members;
DROP POLICY IF EXISTS "Enable update for own memberships" ON public.team_members;
DROP POLICY IF EXISTS "Enable delete for own memberships" ON public.team_members;

-- Créer des politiques optimisées pour team_members
CREATE POLICY "team_members_select_policy" ON public.team_members
FOR SELECT USING (true); -- Lecture publique pour les équipes

CREATE POLICY "team_members_insert_policy" ON public.team_members
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR -- L'utilisateur peut s'ajouter
   EXISTS(SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid())) -- Ou le leader peut ajouter
);

CREATE POLICY "team_members_update_policy" ON public.team_members
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR -- L'utilisateur peut se modifier
   EXISTS(SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid())) -- Ou le leader peut modifier
);

CREATE POLICY "team_members_delete_policy" ON public.team_members
FOR DELETE USING (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR -- L'utilisateur peut se supprimer
   EXISTS(SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid())) -- Ou le leader peut supprimer
);

-- ======= CONVERSATION_PARTICIPANTS =======
-- Supprimer toutes les politiques existantes sur conversation_participants
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view their own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Enable read access for participants" ON conversation_participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON conversation_participants;
DROP POLICY IF EXISTS "Enable delete for own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Allow users to view their own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Allow authenticated users to insert participations" ON conversation_participants;
DROP POLICY IF EXISTS "Allow users to update their own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Allow users to delete their own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update conversation participants" ON conversation_participants;

-- Créer des politiques optimisées pour conversation_participants
CREATE POLICY "conversation_participants_select_policy" ON conversation_participants
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  EXISTS(SELECT 1 FROM conversation_participants cp2 
         WHERE cp2.conversation_id = conversation_participants.conversation_id 
         AND cp2.user_id = auth.uid())
);

CREATE POLICY "conversation_participants_insert_policy" ON conversation_participants
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "conversation_participants_update_policy" ON conversation_participants
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "conversation_participants_delete_policy" ON conversation_participants
FOR DELETE USING (user_id = auth.uid());

-- ======= CONVERSATIONS =======
-- Supprimer toutes les politiques existantes sur conversations
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Enable read access for conversation participants" ON conversations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON conversations;
DROP POLICY IF EXISTS "Enable update for participants" ON conversations;
DROP POLICY IF EXISTS "Allow users to view their conversations" ON conversations;
DROP POLICY IF EXISTS "Allow authenticated users to create conversations" ON conversations;
DROP POLICY IF EXISTS "Allow participants to update conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;

-- Créer des politiques optimisées pour conversations
CREATE POLICY "conversations_select_policy" ON conversations
FOR SELECT USING (public.is_participant(id, auth.uid()));

CREATE POLICY "conversations_insert_policy" ON conversations
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "conversations_update_policy" ON conversations
FOR UPDATE USING (public.is_participant(id, auth.uid()));

-- ======= MESSAGES =======
-- Supprimer toutes les politiques existantes sur messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Enable read access for conversation participants" ON messages;
DROP POLICY IF EXISTS "Enable insert for conversation participants" ON messages;
DROP POLICY IF EXISTS "Enable update for message senders" ON messages;
DROP POLICY IF EXISTS "Allow participants to view messages" ON messages;
DROP POLICY IF EXISTS "Allow participants to send messages" ON messages;
DROP POLICY IF EXISTS "Allow senders to update their messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update their messages" ON messages;

-- Créer des politiques optimisées pour messages
CREATE POLICY "messages_select_policy" ON messages
FOR SELECT USING (public.is_participant(conversation_id, auth.uid()));

CREATE POLICY "messages_insert_policy" ON messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND 
  public.is_participant(conversation_id, auth.uid())
);

CREATE POLICY "messages_update_policy" ON messages
FOR UPDATE USING (sender_id = auth.uid());

-- ======= AIRSOFT_GAMES =======
-- Vérifier et nettoyer les politiques sur airsoft_games
DROP POLICY IF EXISTS "Anyone can view games" ON airsoft_games;
DROP POLICY IF EXISTS "Users can create games" ON airsoft_games;
DROP POLICY IF EXISTS "Creators can update their games" ON airsoft_games;
DROP POLICY IF EXISTS "Creators can delete their games" ON airsoft_games;

-- Créer des politiques optimisées pour airsoft_games
CREATE POLICY "airsoft_games_select_policy" ON airsoft_games
FOR SELECT USING (true); -- Lecture publique des parties

CREATE POLICY "airsoft_games_insert_policy" ON airsoft_games
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "airsoft_games_update_policy" ON airsoft_games
FOR UPDATE USING (created_by = auth.uid() OR is_current_user_admin());

CREATE POLICY "airsoft_games_delete_policy" ON airsoft_games
FOR DELETE USING (created_by = auth.uid() OR is_current_user_admin());

-- ======= STORES =======
-- Nettoyer les politiques sur stores
DROP POLICY IF EXISTS "Anyone can view stores" ON stores;
DROP POLICY IF EXISTS "Admins can manage stores" ON stores;

-- Créer des politiques optimisées pour stores
CREATE POLICY "stores_select_policy" ON stores
FOR SELECT USING (true); -- Lecture publique des magasins

CREATE POLICY "stores_insert_policy" ON stores
FOR INSERT WITH CHECK (is_current_user_admin());

CREATE POLICY "stores_update_policy" ON stores
FOR UPDATE USING (is_current_user_admin());

CREATE POLICY "stores_delete_policy" ON stores
FOR DELETE USING (is_current_user_admin());

-- ======= CRÉER DES INDEX POUR OPTIMISER LES PERFORMANCES =======

-- Index pour team_members (utilisé fréquemment dans les jointures)
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Index pour conversation_participants (utilisé dans is_participant)
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_user 
ON conversation_participants(conversation_id, user_id);

-- Index pour messages (utilisé fréquemment)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Index pour profiles (utilisé dans les politiques admin)
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles("Admin") WHERE "Admin" = true;

-- Index pour teams (utilisé dans les politiques de leadership)
CREATE INDEX IF NOT EXISTS idx_teams_leader_id ON teams(leader_id);

-- ======= OPTIMISER LA FONCTION is_participant =======
-- Recréer la fonction avec une meilleure performance
CREATE OR REPLACE FUNCTION public.is_participant(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
$$;
