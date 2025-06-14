
-- Check if policies exist and create only the missing ones

-- Create policy for team conversation creation (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Users can create team conversations'
    ) THEN
        CREATE POLICY "Users can create team conversations" ON conversations
        FOR INSERT 
        WITH CHECK (
          auth.uid() IS NOT NULL AND 
          type = 'team' AND 
          team_id IS NOT NULL
        );
    END IF;
END $$;

-- Create policy for conversation updates (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Users can update their conversations'
    ) THEN
        CREATE POLICY "Users can update their conversations" ON conversations
        FOR UPDATE 
        USING (
          auth.uid() IS NOT NULL AND 
          EXISTS (
            SELECT 1 FROM conversation_participants 
            WHERE conversation_id = conversations.id 
            AND user_id = auth.uid()
          )
        );
    END IF;
END $$;
