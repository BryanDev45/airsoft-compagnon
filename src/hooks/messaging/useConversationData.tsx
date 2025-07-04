
import { supabase } from '@/integrations/supabase/client';
import { ConversationData, Conversation, Participant, LastMessage } from '@/types/messaging';

export const useConversationData = () => {
  const fetchConversationDetails = async (conv: ConversationData, userId: string): Promise<Conversation | null> => {
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

      let participants: Participant[] = [];
      
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

      let lastMessage: LastMessage | undefined;
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

      // Utiliser la nouvelle fonction pour compter les messages non lus
      const { data: unreadCount, error: unreadError } = await supabase.rpc('count_unread_messages', {
        p_conversation_id: conv.id,
        p_user_id: userId
      });

      if (unreadError) {
        console.error('Error counting unread messages:', unreadError);
      }

      return {
        id: conv.id,
        type: conv.type as 'direct' | 'team',
        name: conv.name || undefined,
        participants,
        lastMessage,
        unread_count: unreadCount || 0
      };
    } catch (error) {
      console.error('Error processing conversation:', error);
      return null;
    }
  };

  return {
    fetchConversationDetails
  };
};
