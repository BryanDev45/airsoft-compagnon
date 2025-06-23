
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import ConversationItem from './ConversationItem';
import EmptyConversations from './EmptyConversations';
import { Conversation } from '@/types/messaging';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Chargement des conversations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Erreur lors du chargement des conversations</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptyConversations />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <p className="text-sm text-gray-500">{conversations.length} conversation{conversations.length > 1 ? 's' : ''}</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ConversationList;
