
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
        console.warn('[ConversationDetails] No conversation ID provided');
        return null;
      }

      if (!user?.id) {
        console.warn('[ConversationDetails] No user ID available');
        return null;
      }

      console.log('[ConversationDetails] Fetching conversation details for:', conversationId);
      
      try {
        // Fetch conversation data - RLS will handle access control
        const { data, error } = await supabase
          .from('conversations')
          .select('id, type, name')
          .eq('id', conversationId)
          .single();

        if (error) {
          console.error('[ConversationDetails] Error fetching conversation:', error);
          throw new Error('Conversation introuvable ou accès refusé');
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
    staleTime: 60000,
    gcTime: 300000,
    retry: (failureCount, error) => {
      // Don't retry permission errors
      if (error?.message?.includes('permission denied') || 
          error?.message?.includes('row-level security') ||
          error?.message?.includes('introuvable')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
