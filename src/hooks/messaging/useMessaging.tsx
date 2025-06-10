
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTeamConversationCreation } from './useTeamConversationCreation';
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

export const useMessaging = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const { createTeamConversationIfNeeded } = useTeamConversationCreation();
  const { fetchConversationDetails } = useConversationData();

  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user?.id) return [];

      try {
        console.log('Fetching conversations for user:', user.id);

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
          console.log('No conversations found for user');
          return [];
        }

        const conversationIds = userParticipations.map(p => p.conversation_id);
        console.log('Found conversation IDs:', conversationIds);

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
          console.log('No conversation data found');
          return [];
        }

        console.log('Fetched conversations data:', conversationsData);

        // Pour chaque conversation, récupérer les détails complets
        const conversationsWithDetails = await Promise.all(
          conversationsData.map(conv => fetchConversationDetails(conv, user.id))
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

        console.log('Final conversations with unread counts:', validConversations.map(c => ({ 
          id: c.id, 
          name: c.name, 
          unread_count: c.unread_count 
        })));

        return validConversations;
      } catch (error) {
        console.error('Error in conversations query:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchInterval: 15000, // Réduire l'intervalle pour une mise à jour plus rapide
    staleTime: 5000, // Considérer les données comme fraîches pendant 5 secondes seulement
  });

  // Calculer le nombre total de messages non lus
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
    console.log('Total unread messages:', totalUnread);
    setUnreadCount(totalUnread);
  }, [conversations]);

  return {
    conversations,
    unreadCount,
    isLoading,
    refetch
  };
};
