
-- Create a unified view for conversation details to reduce multiple queries
CREATE OR REPLACE VIEW conversation_details AS
SELECT 
  c.id,
  c.type,
  c.name,
  c.created_at,
  c.updated_at,
  c.team_id,
  -- Get the latest message for each conversation
  (
    SELECT json_build_object(
      'content', m.content,
      'created_at', m.created_at,
      'sender_id', m.sender_id
    )
    FROM messages m 
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
  ) as participant_count
FROM conversations c;

-- Create a function to get user conversations with all details in one call
CREATE OR REPLACE FUNCTION get_user_conversations_with_details(p_user_id uuid)
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
    cd.id,
    cd.type,
    cd.name,
    cd.created_at,
    cd.updated_at,
    cd.team_id,
    cd.last_message,
    cd.participant_count,
    -- Get other participants with their profile info
    (
      SELECT json_agg(
        json_build_object(
          'user_id', cp.user_id,
          'username', p.username,
          'avatar', p.avatar,
          'last_read_at', cp.last_read_at
        )
      )
      FROM conversation_participants cp
      JOIN profiles p ON p.id = cp.user_id
      WHERE cp.conversation_id = cd.id 
        AND cp.user_id != p_user_id
    ) as other_participants,
    -- Get unread message count
    (
      SELECT COUNT(*)::integer
      FROM messages m
      WHERE m.conversation_id = cd.id
        AND m.sender_id != p_user_id
        AND m.is_deleted = false
        AND NOT EXISTS (
          SELECT 1 FROM message_read_status mrs 
          WHERE mrs.message_id = m.id AND mrs.user_id = p_user_id
        )
    ) as unread_count
  FROM conversation_details cd
  WHERE EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = cd.id AND cp.user_id = p_user_id
  )
  ORDER BY cd.updated_at DESC;
END;
$$;

-- Create a function to get game details with participants in one call
CREATE OR REPLACE FUNCTION get_game_with_participants(p_game_id uuid)
RETURNS TABLE(
  game_data jsonb,
  participants jsonb,
  creator_profile jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Game data as JSON
    to_jsonb(ag.*) as game_data,
    -- Participants with their profiles
    (
      SELECT json_agg(
        json_build_object(
          'id', gp.id,
          'user_id', gp.user_id,
          'game_id', gp.game_id,
          'status', gp.status,
          'role', gp.role,
          'created_at', gp.created_at,
          'profile', json_build_object(
            'id', p.id,
            'username', p.username,
            'firstname', p.firstname,
            'lastname', p.lastname,
            'avatar', p.avatar,
            'is_verified', p.is_verified,
            'reputation', p.reputation
          )
        )
      )
      FROM game_participants gp
      LEFT JOIN profiles p ON p.id = gp.user_id
      WHERE gp.game_id = p_game_id
    ) as participants,
    -- Creator profile
    (
      SELECT to_jsonb(p.*)
      FROM profiles p
      WHERE p.id = ag.created_by
    ) as creator_profile
  FROM airsoft_games ag
  WHERE ag.id = p_game_id;
END;
$$;

-- Create a more efficient notification count function with caching
CREATE OR REPLACE FUNCTION get_user_notification_summary(p_user_id uuid)
RETURNS TABLE(
  unread_count integer,
  total_count integer,
  recent_notifications jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::integer FROM notifications WHERE user_id = p_user_id AND read = false) as unread_count,
    (SELECT COUNT(*)::integer FROM notifications WHERE user_id = p_user_id) as total_count,
    (
      SELECT json_agg(
        json_build_object(
          'id', n.id,
          'title', n.title,
          'message', n.message,
          'type', n.type,
          'read', n.read,
          'created_at', n.created_at,
          'link', n.link
        ) ORDER BY n.created_at DESC
      )
      FROM (
        SELECT * FROM notifications 
        WHERE user_id = p_user_id 
        ORDER BY created_at DESC 
        LIMIT 10
      ) n
    ) as recent_notifications;
END;
$$;

-- Optimize user search function to include team info in one query
CREATE OR REPLACE FUNCTION search_users_optimized(
  p_query text DEFAULT '',
  p_limit integer DEFAULT 20,
  p_is_admin boolean DEFAULT false
)
RETURNS TABLE(
  id uuid,
  username text,
  firstname text,
  lastname text,
  avatar text,
  location text,
  reputation numeric,
  ban boolean,
  is_verified boolean,
  team_info jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.firstname,
    p.lastname,
    p.avatar,
    p.location,
    p.reputation,
    p."Ban",
    p.is_verified,
    CASE 
      WHEN p.team_id IS NOT NULL THEN 
        json_build_object(
          'id', t.id,
          'name', t.name,
          'logo', t.logo
        )
      ELSE NULL
    END as team_info
  FROM profiles p
  LEFT JOIN teams t ON t.id = p.team_id
  WHERE 
    (NOT p."Ban" OR p_is_admin = true)
    AND (
      p_query = '' OR
      p.username ILIKE '%' || p_query || '%' OR
      p.firstname ILIKE '%' || p_query || '%' OR
      p.lastname ILIKE '%' || p_query || '%'
    )
  ORDER BY p.reputation DESC NULLS LAST
  LIMIT p_limit;
END;
$$;
