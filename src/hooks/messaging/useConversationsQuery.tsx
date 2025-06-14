
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTeamConversationManager } from './useTeamConversationManager';
import { useConversationData } from './useConversationData';

interface Conversation {
  id: string;
  type: 'direct' | 'team';
  name?: string;
  participants: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
  lastMessage?: {
    content: string;
    created_at: string;
    sender_name: string;
  };
  unread_count: number;
}

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
            // Cast the type to ensure it matches our interface
            const typedConv = {
              ...conv,
              type: conv.type as 'direct' | 'team'
            };
            return await fetchConversationDetails(typedConv, user.id);
          })
        );

        // Filtrer les conversations nulles et trier par dernière activité
        const validConversations = conversationsWithDetails
          .filter((conv) => conv !== null)
          .sort((a, b) => {
            // Prioriser les conversations avec des messages non lus
            if (a.unread_count > 0 && b.unread_count === 0) return -1;
            if (b.unread_count > 0 && a.unread_count === 0) return 1;
            
            // Ensuite trier par dernière activité
            if (a.lastMessage && b.lastMessage) {
              return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
            } else if (a.lastMessage) {
              return -1;
            } else if (b.lastMessage) {
              return 1;
            }
            
            return 0;
          });

        return validConversations;
      } catch (error) {
        console.error('Error in conversations query:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    staleTime: 10000, // Considérer les données comme fraîches pendant 10 secondes
  });
};
