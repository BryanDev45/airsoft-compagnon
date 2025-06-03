
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Clock } from 'lucide-react';

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
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const truncateMessage = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
              <p className="text-gray-500 text-sm">
                Vos conversations apparaîtront ici
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full h-auto p-4 justify-start hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm group"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                      {getConversationAvatar(conversation) ? (
                        <AvatarImage src={getConversationAvatar(conversation)} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-medium">
                          {conversation.type === 'team' ? (
                            <Users className="h-6 w-6" />
                          ) : (
                            getConversationName(conversation).charAt(0).toUpperCase()
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {conversation.unread_count > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-airsoft-red hover:bg-airsoft-red text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                        {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-airsoft-red transition-colors">
                          {getConversationName(conversation)}
                        </h3>
                        {conversation.type === 'team' && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                            Équipe
                          </Badge>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(conversation.lastMessage.created_at)}</span>
                        </div>
                      )}
                    </div>
                    
                    {conversation.lastMessage ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 truncate">
                          <span className="font-medium text-gray-700">
                            {conversation.lastMessage.sender_name}:
                          </span>{' '}
                          {truncateMessage(conversation.lastMessage.content)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        Aucun message
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
