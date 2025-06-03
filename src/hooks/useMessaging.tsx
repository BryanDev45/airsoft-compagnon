import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  type: 'direct' | 'team';
  name?: string; // Made optional to match actual usage
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

  // Fonction optimisée pour créer une conversation d'équipe
  const createTeamConversationIfNeeded = async (teamId: string, teamName: string) => {
    try {
      // Vérifier si une conversation d'équipe existe déjà
      const { data: existingConversation, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('type', 'team')
        .eq('team_id', teamId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing team conversation:', checkError);
        return;
      }

      if (!existingConversation) {
        console.log(`Creating team conversation for team: ${teamName}`);
        
        // Créer la conversation d'équipe
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            type: 'team',
            name: `Équipe ${teamName}`,
            team_id: teamId
          })
          .select('id')
          .single();

        if (conversationError) {
          console.error('Error creating team conversation:', conversationError);
          return;
        }

        // Ajouter tous les membres confirmés de l'équipe à la conversation
        const { data: teamMembers, error: membersError } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', teamId)
          .eq('status', 'confirmed');

        if (membersError) {
          console.error('Error fetching team members:', membersError);
          return;
        }

        if (teamMembers && teamMembers.length > 0) {
          const participants = teamMembers.map(member => ({
            conversation_id: newConversation.id,
            user_id: member.user_id
          }));

          const { error: participantsError } = await supabase
            .from('conversation_participants')
            .insert(participants);

          if (participantsError) {
            console.error('Error adding participants to team conversation:', participantsError);
          } else {
            console.log(`Successfully added ${participants.length} participants to team conversation`);
          }
        }
      }
    } catch (error) {
      console.error('Error in createTeamConversationIfNeeded:', error);
    }
  };

  const { data: conversations = [], isLoading, refetch } = useQuery({
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
            try {
              // Récupérer les participants (excluant l'utilisateur actuel pour les conversations directes)
              const { data: participantsData, error: participantsError } = await supabase
                .from('conversation_participants')
                .select('user_id, last_read_at')
                .eq('conversation_id', conv.id)
                .neq('user_id', user.id);

              if (participantsError) {
                console.error('Error fetching participants:', participantsError);
                return null;
              }

              let participants: Array<{ id: string; username: string; avatar?: string }> = [];
              
              if (participantsData && participantsData.length > 0) {
                const { data: profilesData, error: profilesError } = await supabase
                  .from('profiles')
                  .select('id, username, avatar')
                  .in('id', participantsData.map(p => p.user_id));

                if (!profilesError && profilesData) {
                  participants = profilesData;
                }
              }

              // Récupérer le dernier message
              const { data: lastMessageData, error: messageError } = await supabase
                .from('messages')
                .select(`
                  content,
                  created_at,
                  sender_id
                `)
                .eq('conversation_id', conv.id)
                .eq('is_deleted', false)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              let lastMessage;
              if (!messageError && lastMessageData) {
                const { data: senderData } = await supabase
                  .from('profiles')
                  .select('username')
                  .eq('id', lastMessageData.sender_id)
                  .single();

                lastMessage = {
                  content: lastMessageData.content,
                  created_at: lastMessageData.created_at,
                  sender_name: senderData?.username || 'Utilisateur'
                };
              }

              // Calculer les messages non lus
              const { data: userParticipantData } = await supabase
                .from('conversation_participants')
                .select('last_read_at')
                .eq('conversation_id', conv.id)
                .eq('user_id', user.id)
                .single();

              let unread_count = 0;
              if (userParticipantData?.last_read_at) {
                const { count } = await supabase
                  .from('messages')
                  .select('*', { count: 'exact', head: true })
                  .eq('conversation_id', conv.id)
                  .neq('sender_id', user.id)
                  .eq('is_deleted', false)
                  .gt('created_at', userParticipantData.last_read_at);

                unread_count = count || 0;
              } else {
                // Si pas de last_read_at, compter tous les messages non envoyés par l'utilisateur
                const { count } = await supabase
                  .from('messages')
                  .select('*', { count: 'exact', head: true })
                  .eq('conversation_id', conv.id)
                  .neq('sender_id', user.id)
                  .eq('is_deleted', false);

                unread_count = count || 0;
              }

              return {
                id: conv.id,
                type: conv.type as 'direct' | 'team',
                name: conv.name || undefined,
                participants,
                lastMessage,
                unread_count
              };
            } catch (error) {
              console.error('Error processing conversation:', error);
              return null;
            }
          })
        );

        // Filtrer les conversations nulles et trier par dernière activité
        const validConversations = conversationsWithDetails
          .filter((conv): conv is Conversation => conv !== null)
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

  // Calculer le nombre total de messages non lus
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
    setUnreadCount(totalUnread);
  }, [conversations]);

  return {
    conversations,
    unreadCount,
    isLoading,
    refetch
  };
};
