
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ConversationDetails, Participant } from '@/types/messaging';

export const useConversationDetails = (conversationId: string) => {
  const { user } = useAuth();

  return useQuery<ConversationDetails | null, Error>({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<ConversationDetails | null> => {
      if (!conversationId) {
        console.warn('No conversation ID provided');
        return null;
      }

      console.log('[ConversationDetails] Fetching conversation details for:', conversationId);
      
      try {
        // First check if user has access to this conversation
        const { data: participantCheck, error: participantError } = await supabase
          .from('conversation_participants')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('user_id', user?.id)
          .single();

        if (participantError || !participantCheck) {
          console.error('[ConversationDetails] User not participant or access denied:', participantError);
          throw new Error('Accès refusé à cette conversation');
        }

        // Fetch conversation data
        const { data, error } = await supabase
          .from('conversations')
          .select('id, type, name')
          .eq('id', conversationId)
          .single();

        if (error) {
          console.error('[ConversationDetails] Error fetching conversation:', error);
          throw new Error('Conversation introuvable');
        }

        if (!data) {
          console.warn('[ConversationDetails] No conversation data found');
          return null;
        }

        console.log('[ConversationDetails] Conversation data:', data);

        // Fetch participants
        let participants: Participant[] = [];
        
        const { data: participantsData, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversationId);

        if (!participantsError && participantsData && participantsData.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar')
            .in('id', participantsData.map(p => p.user_id));

          if (!profilesError && profilesData) {
            participants = profilesData;
          }
        }

        const result = {
          id: data.id,
          type: data.type as 'direct' | 'team',
          name: data.name,
          participants
        };

        console.log('[ConversationDetails] Final conversation details:', result);
        return result;
      } catch (error) {
        console.error('[ConversationDetails] Query failed:', error);
        throw error;
      }
    },
    enabled: !!conversationId && !!user?.id,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry permission errors
      if (error?.message?.includes('Accès refusé') || error?.message?.includes('introuvable')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
