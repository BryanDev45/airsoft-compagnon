
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConversationDetails {
  id: string;
  type: 'direct' | 'team';
  name?: string;
  participants?: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
}

export const useConversationDetails = (conversationId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<ConversationDetails | null> => {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, type, name')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        return null;
      }

      // Récupérer les participants pour les conversations directes
      let participants: Array<{ id: string; username: string; avatar?: string }> = [];
      
      if (data.type === 'direct') {
        const { data: participantsData, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversationId)
          .neq('user_id', user?.id);

        if (!participantsError && participantsData && participantsData.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar')
            .in('id', participantsData.map(p => p.user_id));

          if (!profilesError && profilesData) {
            participants = profilesData;
          }
        }
      }

      return {
        id: data.id,
        type: data.type as 'direct' | 'team',
        name: data.name,
        participants
      };
    },
    enabled: !!conversationId,
  });
};
