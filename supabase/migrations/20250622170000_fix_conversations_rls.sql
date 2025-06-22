
-- Fix RLS policies for messaging system

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;

DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;

-- Create comprehensive RLS policies for conversations
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

-- Create policies for conversation_participants
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

CREATE POLICY "Users can update conversation participants" 
  ON conversation_participants 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR 
     EXISTS (
       SELECT 1 FROM conversation_participants cp2 
       WHERE cp2.conversation_id = conversation_participants.conversation_id 
       AND cp2.user_id = auth.uid()
     ))
  );

-- Create policies for messages
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

CREATE POLICY "Users can update their messages" 
  ON messages 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    sender_id = auth.uid()
  );

-- Create policies for message_read_status
DROP POLICY IF EXISTS "Users can view their message read status" ON message_read_status;
DROP POLICY IF EXISTS "Users can update their message read status" ON message_read_status;

CREATE POLICY "Users can view their message read status" 
  ON message_read_status 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR 
     EXISTS (
       SELECT 1 FROM messages m 
       JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
       WHERE m.id = message_read_status.message_id 
       AND cp.user_id = auth.uid()
     ))
  );

CREATE POLICY "Users can manage their message read status" 
  ON message_read_status 
  FOR ALL 
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Ensure RLS is enabled on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_status ENABLE ROW LEVEL SECURITY;
