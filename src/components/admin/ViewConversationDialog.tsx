
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messaging';
import MessageItem from '@/components/messaging/MessageItem';

interface ViewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string | null;
}

const ViewConversationDialog: React.FC<ViewConversationDialogProps> = ({
  open,
  onOpenChange,
  conversationId
}) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-conversation-messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      if (!conversationId) return [];

      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          is_deleted
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      if (!messagesData || messagesData.length === 0) {
        return [];
      }

      // Récupérer les informations des expéditeurs
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: sendersData } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', senderIds);

      const sendersMap = new Map(sendersData?.map(s => [s.id, s]) || []);

      return messagesData.map(message => {
        const sender = sendersMap.get(message.sender_id);
        return {
          ...message,
          sender_name: sender?.username || 'Utilisateur',
          sender_avatar: sender?.avatar
        };
      });
    },
    enabled: !!conversationId && open
  });

  const { data: conversationInfo } = useQuery({
    queryKey: ['admin-conversation-info', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;

      const { data, error } = await supabase
        .from('conversations')
        .select('type, name')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId && open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Conversation signalée</DialogTitle>
          <DialogDescription>
            {conversationInfo?.type === 'team' 
              ? `Conversation d'équipe: ${conversationInfo.name || 'Sans nom'}` 
              : 'Conversation privée'
            }
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement de la conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun message dans cette conversation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={message.is_deleted ? 'opacity-50' : ''}>
                  {message.is_deleted ? (
                    <div className="text-gray-500 italic text-center py-2">
                      [Message supprimé]
                    </div>
                  ) : (
                    <MessageItem message={message} />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewConversationDialog;
