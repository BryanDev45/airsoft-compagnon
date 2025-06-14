
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/types/messaging';
import ConversationItem from './ConversationItem';
import EmptyConversations from './EmptyConversations';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation
}) => {
  return (
    <div className="w-full h-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          {conversations.length === 0 ? (
            <EmptyConversations />
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onSelect={onSelectConversation}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
