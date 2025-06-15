
-- Drop existing problematic policies if they exist
DROP POLICY IF EXISTS "Users can create team conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;

-- Create comprehensive RLS policies for conversations table
CREATE POLICY "Users can view their conversations" 
  ON conversations 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversations.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create conversations" 
  ON conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their conversations" 
  ON conversations 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversations.id 
      AND user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Add policies for conversation_participants (drop first if exists)
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;

CREATE POLICY "Users can view conversation participants" 
  ON conversation_participants 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR 
     EXISTS (
       SELECT 1 FROM conversation_participants cp2 
       WHERE cp2.conversation_id = conversation_participants.conversation_id 
       AND cp2.user_id = auth.uid()
     ))
  );

CREATE POLICY "Users can add conversation participants" 
  ON conversation_participants 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled for conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Add policies for messages (drop first if exists)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;

CREATE POLICY "Users can view messages in their conversations" 
  ON messages 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations" 
  ON messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
