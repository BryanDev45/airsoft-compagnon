
-- Fix the get_user_conversations_with_details function to return jsonb instead of json
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
    -- Get last message with sender name (returning jsonb)
    (
      SELECT CASE 
        WHEN m.id IS NOT NULL THEN 
          jsonb_build_object(
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
    -- Get other participants with their profile info (returning jsonb)
    (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id', cp.user_id,
            'username', p.username,
            'avatar', p.avatar
          )
        ),
        '[]'::jsonb
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
