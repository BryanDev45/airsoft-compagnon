
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ConversationDetails, Participant } from '@/types/messaging';

export const useConversationDetails = (conversationId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<ConversationDetails | null> => {
      console.log('Fetching conversation details for:', conversationId);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('id, type, name')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        return null;
      }

      console.log('Conversation data:', data);

      // Récupérer TOUS les participants de la conversation
      let participants: Participant[] = [];
      
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

      console.log('Participants data:', participantsData);

      if (!participantsError && participantsData && participantsData.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar')
          .in('id', participantsData.map(p => p.user_id));

        console.log('Profiles data:', profilesData);

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

      console.log('Final conversation details:', result);
      return result;
    },
    enabled: !!conversationId,
  });
};
