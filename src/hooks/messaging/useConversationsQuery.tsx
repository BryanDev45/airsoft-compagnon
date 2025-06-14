
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTeamConversationManager } from './useTeamConversationManager';
import { useConversationData } from './useConversationData';
import { useOptimizedQueries } from './useOptimizedQueries';
import { Conversation } from '@/types/messaging';
import { sortConversations } from '@/utils/messaging';
import { useCallback, useRef } from 'react';

export const useConversationsQuery = () => {
  const { user } = useAuth();
  const { createTeamConversationIfNeeded } = useTeamConversationManager();
  const { fetchConversationDetails } = useConversationData();
  const { optimizedQueryConfig } = useOptimizedQueries();
  const errorCountRef = useRef(0);

  const queryFn = useCallback(async (): Promise<Conversation[]> => {
    if (!user?.id) return [];

    try {
      // Récupérer les informations de l'équipe de l'utilisateur seulement une fois
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('team_id, team')
        .eq('id', user.id)
        .single();

      // Ne créer la conversation d'équipe que si nécessaire et pas trop d'erreurs
      if (!profileError && userProfile?.team_id && userProfile?.team && errorCountRef.current < 3) {
        try {
          await createTeamConversationIfNeeded(userProfile.team_id, userProfile.team);
          errorCountRef.current = 0; // Reset error count on success
        } catch (error) {
          errorCountRef.current++;
          console.error('Error creating team conversation, attempt:', errorCountRef.current, error);
          // Stop trying after 3 attempts to prevent infinite loops
          if (errorCountRef.current >= 3) {
            console.warn('Stopped attempting to create team conversation after 3 failures');
          }
        }
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
        .filter((conv): conv is Conversation => conv !== null);

      return sortConversations(validConversations);
    } catch (error) {
      console.error('Error in conversations query:', error);
      return [];
    }
  }, [user?.id, createTeamConversationIfNeeded, fetchConversationDetails]);

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn,
    enabled: !!user?.id,
    ...optimizedQueryConfig('conversations', {
      refetchInterval: 120000, // Reduced from 60s to 2 minutes
      staleTime: 60000, // Increased from 30s to 60s
      gcTime: 600000, // 10 minutes cache time
    })
  });
};
