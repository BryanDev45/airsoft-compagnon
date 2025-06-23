
-- Supprimer toutes les politiques problématiques existantes
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Authenticated users can add participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participation record" ON conversation_participants;
DROP POLICY IF EXISTS "Users can remove themselves from conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Enable read access for participants" ON conversation_participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON conversation_participants;
DROP POLICY IF EXISTS "Enable delete for own participations" ON conversation_participants;

-- Supprimer les politiques des conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Enable read access for conversation participants" ON conversations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON conversations;
DROP POLICY IF EXISTS "Enable update for participants" ON conversations;

-- Supprimer les politiques des messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
DROP POLICY IF EXISTS "Enable read access for conversation participants" ON messages;
DROP POLICY IF EXISTS "Enable insert for conversation participants" ON messages;
DROP POLICY IF EXISTS "Enable update for message senders" ON messages;

-- Créer des politiques simples et non-récursives pour conversation_participants
CREATE POLICY "Allow users to view their own participations" ON conversation_participants
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to insert participations" ON conversation_participants
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update their own participations" ON conversation_participants
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Allow users to delete their own participations" ON conversation_participants
FOR DELETE USING (user_id = auth.uid());

-- Créer des politiques simples pour conversations en utilisant la fonction sécurisée existante
CREATE POLICY "Allow users to view their conversations" ON conversations
FOR SELECT USING (public.is_participant(id, auth.uid()));

CREATE POLICY "Allow authenticated users to create conversations" ON conversations
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow participants to update conversations" ON conversations
FOR UPDATE USING (public.is_participant(id, auth.uid()));

-- Créer des politiques simples pour messages
CREATE POLICY "Allow participants to view messages" ON messages
FOR SELECT USING (public.is_participant(conversation_id, auth.uid()));

CREATE POLICY "Allow participants to send messages" ON messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND 
  public.is_participant(conversation_id, auth.uid())
);

CREATE POLICY "Allow senders to update their messages" ON messages
FOR UPDATE USING (sender_id = auth.uid());

-- Créer des politiques pour message_read_status
DROP POLICY IF EXISTS "Users can view their message read status" ON message_read_status;
DROP POLICY IF EXISTS "Users can manage their message read status" ON message_read_status;

CREATE POLICY "Allow users to manage their read status" ON message_read_status
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
