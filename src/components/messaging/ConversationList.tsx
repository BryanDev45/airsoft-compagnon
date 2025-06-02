
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Users } from 'lucide-react';

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

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation
}) => {
  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'team') {
      return conversation.name || 'Conversation d\'équipe';
    }
    // Pour les conversations directes, afficher le nom de l'autre participant
    const otherParticipant = conversation.participants[0];
    return otherParticipant?.username || 'Utilisateur';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants[0];
      return otherParticipant?.avatar;
    }
    return null;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune conversation</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full h-auto p-3 justify-start hover:bg-gray-50"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      {getConversationAvatar(conversation) ? (
                        <AvatarImage src={getConversationAvatar(conversation)} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white">
                          {conversation.type === 'team' ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            getConversationName(conversation).charAt(0).toUpperCase()
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {conversation.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-airsoft-red text-white text-xs flex items-center justify-center">
                        {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {getConversationName(conversation)}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        <span className="font-medium">{conversation.lastMessage.sender_name}:</span>{' '}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
