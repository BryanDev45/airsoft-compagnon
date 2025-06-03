
import { supabase } from '@/integrations/supabase/client';

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

/**
 * Hook pour récupérer et traiter les données de conversations
 */
export const useConversationData = () => {
  const fetchConversationDetails = async (conv: any, userId: string): Promise<Conversation | null> => {
    try {
      // Récupérer les participants (excluant l'utilisateur actuel pour les conversations directes)
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id, last_read_at')
        .eq('conversation_id', conv.id)
        .neq('user_id', userId);

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
        .eq('user_id', userId)
        .single();

      let unread_count = 0;
      if (userParticipantData?.last_read_at) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', userId)
          .eq('is_deleted', false)
          .gt('created_at', userParticipantData.last_read_at);

        unread_count = count || 0;
      } else {
        // Si pas de last_read_at, compter tous les messages non envoyés par l'utilisateur
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', userId)
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
  };

  return { fetchConversationDetails };
};
