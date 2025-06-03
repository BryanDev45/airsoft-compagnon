
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

  // Fonction pour créer une conversation d'équipe si elle n'existe pas
  const createTeamConversationIfNeeded = async (teamId: string, teamName: string) => {
    // Vérifier si une conversation d'équipe existe déjà
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('type', 'team')
      .eq('team_id', teamId)
      .single();

    if (!existingConversation) {
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

      // Ajouter tous les membres de l'équipe à la conversation
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('status', 'confirmed');

      if (teamMembers && teamMembers.length > 0) {
        const participants = teamMembers.map(member => ({
          conversation_id: newConversation.id,
          user_id: member.user_id
        }));

        await supabase
          .from('conversation_participants')
          .insert(participants);
      }
    }
  };

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user?.id) return [];

      // Vérifier si l'utilisateur fait partie d'une équipe et créer la conversation si nécessaire
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('team_id, team')
        .eq('id', user.id)
        .single();

      if (userProfile?.team_id && userProfile?.team) {
        await createTeamConversationIfNeeded(userProfile.team_id, userProfile.team);
      }

      // Récupérer les conversations de l'utilisateur
      const { data: userParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (!userParticipations || userParticipations.length === 0) {
        return [];
      }

      const conversationIds = userParticipations.map(p => p.conversation_id);

      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          type,
          name,
          created_at
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

      // Pour chaque conversation, récupérer les participants et le dernier message
      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conv) => {
          // Récupérer les participants (sauf l'utilisateur actuel pour les conversations directes)
          const { data: participantsData } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              last_read_at
            `)
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id);

          let participants: Array<{ id: string; username: string; avatar?: string }> = [];
          
          if (participantsData && participantsData.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, username, avatar')
              .in('id', participantsData.map(p => p.user_id));

            participants = profilesData || [];
          }

          // Récupérer le dernier message
          const { data: lastMessageData } = await supabase
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
            .single();

          let lastMessage;
          if (lastMessageData) {
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
              .gt('created_at', userParticipantData.last_read_at);

            unread_count = count || 0;
          }

          return {
            id: conv.id,
            type: conv.type as 'direct' | 'team',
            name: conv.name,
            participants,
            lastMessage,
            unread_count
          };
        })
      );

      return conversationsWithDetails;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  // Calculer le nombre total de messages non lus
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
    setUnreadCount(totalUnread);
  }, [conversations]);

  return {
    conversations,
    unreadCount,
    isLoading
  };
};
