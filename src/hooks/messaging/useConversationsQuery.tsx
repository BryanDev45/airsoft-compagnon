
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTeamConversationManager } from './useTeamConversationManager';
import { useConversationData } from './useConversationData';
import { Conversation } from '@/types/messaging';
import { sortConversations } from '@/utils/messaging';

export const useConversationsQuery = () => {
  const { user } = useAuth();
  const { createTeamConversationIfNeeded } = useTeamConversationManager();
  const { fetchConversationDetails } = useConversationData();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user?.id) return [];

      try {
        // Récupérer les informations de l'équipe de l'utilisateur
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('team_id, team')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (userProfile?.team_id && userProfile?.team) {
          // Créer automatiquement la conversation d'équipe si nécessaire
          await createTeamConversationIfNeeded(userProfile.team_id, userProfile.team);
        }

        // Récupérer les conversations de l'utilisateur
        const { data: userParticipations, error: participationsError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (participationsError) {
          console.error('Error fetching user participations:', participationsError);
          return [];
        }

        if (!userParticipations || userParticipations.length === 0) {
          return [];
        }

        const conversationIds = userParticipations.map(p => p.conversation_id);

        // Récupérer les données des conversations
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select(`
            id,
            type,
            name,
            created_at,
            updated_at
          `)
          .in('id', conversationIds)
          .order('updated_at', { ascending: false });

        if (conversationsError) {
          console.error('Error fetching conversations:', conversationsError);
          throw conversationsError;
        }

        if (!conversationsData || conversationsData.length === 0) {
          return [];
        }

        // Pour chaque conversation, récupérer les détails complets
        const conversationsWithDetails = await Promise.all(
          conversationsData.map(async (conv) => {
            const typedConv = {
              ...conv,
              type: conv.type as 'direct' | 'team'
            };
            return await fetchConversationDetails(typedConv, user.id);
          })
        );

        // Filtrer les conversations nulles et trier
        const validConversations = conversationsWithDetails
          .filter((conv) => conv !== null);

        return sortConversations(validConversations);
      } catch (error) {
        console.error('Error in conversations query:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};
