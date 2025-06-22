
-- Activer RLS sur toutes les tables de messagerie si ce n'est pas déjà fait
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_status ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes pour les recréer proprement
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;

DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update conversation participants" ON conversation_participants;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update their messages" ON messages;

DROP POLICY IF EXISTS "Users can view their message read status" ON message_read_status;
DROP POLICY IF EXISTS "Users can manage their message read status" ON message_read_status;

-- Créer les politiques RLS pour conversations
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

-- Créer les politiques pour conversation_participants
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

-- Créer les politiques pour messages
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

-- Créer les politiques pour message_read_status
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

-- Corriger la fonction get_user_conversations_with_details pour qu'elle retourne les bonnes colonnes
DROP FUNCTION IF EXISTS public.get_user_conversations_with_details(uuid);

CREATE OR REPLACE FUNCTION public.get_user_conversations_with_details(p_user_id uuid)
RETURNS TABLE(
  conversation_id uuid, 
  conversation_type text, 
  conversation_name text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  team_id uuid, 
  last_message jsonb, 
  participant_count bigint, 
  other_participants jsonb, 
  unread_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    c.type as conversation_type,
    c.name as conversation_name,
    c.created_at,
    c.updated_at,
    c.team_id,
    -- Get last message with sender name
    (
      SELECT CASE 
        WHEN m.id IS NOT NULL THEN 
          json_build_object(
            'content', m.content,
            'created_at', m.created_at,
            'sender_name', COALESCE(p_sender.username, 'Utilisateur')
          )
        ELSE NULL 
      END
      FROM messages m
      LEFT JOIN profiles p_sender ON p_sender.id = m.sender_id
      WHERE m.conversation_id = c.id 
        AND m.is_deleted = false
      ORDER BY m.created_at DESC
      LIMIT 1
    ) as last_message,
    -- Get participant count
    (
      SELECT COUNT(*)
      FROM conversation_participants cp
      WHERE cp.conversation_id = c.id
    ) as participant_count,
    -- Get other participants with their profile info
    (
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'id', cp.user_id,
            'username', p.username,
            'avatar', p.avatar
          )
        ),
        '[]'::json
      )
      FROM conversation_participants cp
      JOIN profiles p ON p.id = cp.user_id
      WHERE cp.conversation_id = c.id 
        AND cp.user_id != p_user_id
    ) as other_participants,
    -- Get unread message count
    (
      SELECT COUNT(*)::integer
      FROM messages m
      WHERE m.conversation_id = c.id
        AND m.sender_id != p_user_id
        AND m.is_deleted = false
        AND NOT EXISTS (
          SELECT 1 FROM message_read_status mrs 
          WHERE mrs.message_id = m.id AND mrs.user_id = p_user_id
        )
    ) as unread_count
  FROM conversations c
  WHERE EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = c.id AND cp.user_id = p_user_id
  )
  ORDER BY c.updated_at DESC;
END;
$$;
