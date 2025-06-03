
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

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user?.id) return [];

      // Récupérer les conversations de l'utilisateur via les participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          last_read_at,
          conversations!inner(
            id,
            type,
            name,
            team_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (participantsError) {
        console.error('Error fetching user conversations:', participantsError);
        throw participantsError;
      }

      if (!participantsData || participantsData.length === 0) {
        return [];
      }

      // Traiter chaque conversation
      const conversationsWithDetails = await Promise.all(
        participantsData.map(async (participant: any) => {
          const conv = participant.conversations;
          
          // Récupérer les autres participants (pour les conversations directes)
          const { data: otherParticipantsData } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              profiles!inner(id, username, avatar)
            `)
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id);

          let participants: Array<{ id: string; username: string; avatar?: string }> = [];
          
          if (otherParticipantsData) {
            participants = otherParticipantsData.map((p: any) => ({
              id: p.profiles.id,
              username: p.profiles.username,
              avatar: p.profiles.avatar
            }));
          }

          // Récupérer le dernier message
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select(`
              content,
              created_at,
              sender_id,
              profiles!inner(username)
            `)
            .eq('conversation_id', conv.id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let lastMessage;
          if (lastMessageData) {
            lastMessage = {
              content: lastMessageData.content,
              created_at: lastMessageData.created_at,
              sender_name: (lastMessageData.profiles as any).username || 'Utilisateur'
            };
          }

          // Calculer les messages non lus
          let unread_count = 0;
          if (participant.last_read_at) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', user.id)
              .gt('created_at', participant.last_read_at)
              .eq('is_deleted', false);

            unread_count = count || 0;
          } else {
            // Si jamais lu, compter tous les messages des autres
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', user.id)
              .eq('is_deleted', false);

            unread_count = count || 0;
          }

          // Déterminer le nom de la conversation
          let conversationName = conv.name;
          if (conv.type === 'direct' && participants.length > 0) {
            conversationName = participants[0].username;
          }

          return {
            id: conv.id,
            type: conv.type as 'direct' | 'team',
            name: conversationName,
            participants,
            lastMessage,
            unread_count
          };
        })
      );

      // Trier par dernier message ou date de création
      return conversationsWithDetails.sort((a, b) => {
        const aDate = a.lastMessage?.created_at || '';
        const bDate = b.lastMessage?.created_at || '';
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
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
