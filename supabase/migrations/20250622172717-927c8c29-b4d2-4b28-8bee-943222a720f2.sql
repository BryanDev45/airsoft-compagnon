
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view their own participations" ON conversation_participants;

-- Create simple, non-recursive policies for conversation_participants
CREATE POLICY "Enable read access for participants" ON conversation_participants
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enable insert for authenticated users" ON conversation_participants
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable delete for own participations" ON conversation_participants
FOR DELETE USING (user_id = auth.uid());

-- Drop existing problematic policies for conversations
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;

-- Create simple policy for conversations
CREATE POLICY "Enable read access for conversation participants" ON conversations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Enable insert for authenticated users" ON conversations
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for participants" ON conversations
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
  )
);

-- Drop existing problematic policies for messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Create simple policies for messages
CREATE POLICY "Enable read access for conversation participants" ON messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Enable insert for conversation participants" ON messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Enable update for message senders" ON messages
FOR UPDATE USING (sender_id = auth.uid());
