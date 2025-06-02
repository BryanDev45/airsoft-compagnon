
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

      // Récupérer les conversations de l'utilisateur
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          type,
          name,
          created_at
        `)
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
          // Récupérer les participants
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
