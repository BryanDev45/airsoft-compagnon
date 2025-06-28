
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare } from 'lucide-react';
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
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="relative">
            <div className="absolute inset-0 bg-airsoft-red/20 rounded-full blur-lg"></div>
            <div className="relative p-4 bg-gradient-to-br from-airsoft-red to-red-600 rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700">Chargement des conversations</p>
            <p className="text-sm text-gray-500 mt-1">Veuillez patienter...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
          <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-3">
            <MessageSquare className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptyConversations />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
        </div>
        <p className="text-sm text-gray-600">
          {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
          {conversations.filter(c => c.unread_count > 0).length > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {conversations.filter(c => c.unread_count > 0).length} non lu{conversations.filter(c => c.unread_count > 0).length > 1 ? 'es' : 'e'}
            </span>
          )}
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
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
