
-- Step 1: Create a security definer function to safely check for conversation participation, avoiding recursion.
CREATE OR REPLACE FUNCTION public.is_participant(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
END;
$$;


-- Step 2: Remove the old, problematic policies from the conversation_participants table.
DROP POLICY IF EXISTS "Users can view conversation participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON public.conversation_participants;


-- Step 3: Create new, non-recursive policies for the conversation_participants table.
-- Policy for viewing participants:
CREATE POLICY "Users can view participants of their conversations"
  ON public.conversation_participants
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    (
      user_id = auth.uid() OR
      public.is_participant(conversation_id, auth.uid())
    )
  );

-- Policy for adding participants (kept simple to avoid breaking existing logic):
CREATE POLICY "Authenticated users can add participants" 
  ON public.conversation_participants 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Policy for updating participant records (e.g., last_read_at):
CREATE POLICY "Users can update their own participation record"
  ON public.conversation_participants
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- Policy for removing participants (leaving a conversation):
CREATE POLICY "Users can remove themselves from conversations"
  ON public.conversation_participants
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );


-- Step 4: Remove the old policy from the conversations table that also caused recursion.
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;


-- Step 5: Recreate the policy for viewing conversations using the new, safe function.
CREATE POLICY "Users can view their conversations" 
  ON public.conversations 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND
    public.is_participant(id, auth.uid())
  );
