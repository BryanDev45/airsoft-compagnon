
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Conversation } from '@/types/messaging';

interface ConversationData {
  conversation_id: string;
  conversation_type: 'direct' | 'team';
  conversation_name: string | null;
  created_at: string;
  updated_at: string;
  team_id: string | null;
  last_message: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
  participant_count: number;
  other_participants: Array<{
    id: string;
    username: string;
    avatar: string | null;
  }> | null;
  unread_count: number;
}

export const useOptimizedConversations = () => {
  const { user } = useAuth();

  const queryFn = async (): Promise<Conversation[]> => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase.rpc('get_user_conversations_with_details', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching optimized conversations:', error);
        throw error;
      }

      if (!data) return [];

      console.log('Raw conversation data:', data);

      // Transform the data to match our Conversation interface
      const conversations: Conversation[] = data.map((conv: ConversationData) => {
        let lastMessage = undefined;
        if (conv.last_message) {
          lastMessage = {
            content: conv.last_message.content,
            created_at: conv.last_message.created_at,
            sender_name: conv.last_message.sender_name
          };
        }

        const participants = Array.isArray(conv.other_participants) 
          ? conv.other_participants.map(p => ({
              id: p.id,
              username: p.username,
              avatar: p.avatar
            })) 
          : [];

        console.log(`Conversation ${conv.conversation_id}:`, {
          participants,
          lastMessage,
          unread_count: conv.unread_count
        });

        return {
          id: conv.conversation_id,
          type: conv.conversation_type,
          name: conv.conversation_name || undefined,
          participants,
          lastMessage,
          unread_count: conv.unread_count
        };
      });

      console.log('Transformed conversations:', conversations);
      return conversations;
    } catch (error) {
      console.error('Error in optimized conversations query:', error);
      return [];
    }
  };

  return useQuery<Conversation[], Error>({
    queryKey: ['optimized-conversations', user?.id],
    queryFn,
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: false,
  });
};
