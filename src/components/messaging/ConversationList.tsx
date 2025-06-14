
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Clock, Dot } from 'lucide-react';

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
        <div className="p-4 space-y-3">
          {conversations.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gray-100 rounded-full blur-sm"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border border-gray-200/60 shadow-sm">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune conversation</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Vos conversations apparaîtront ici
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full h-auto p-0 justify-start hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 group border border-transparent hover:border-blue-100/60 bg-white/40 backdrop-blur-sm"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-4 w-full p-4">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all duration-300">
                      {getConversationAvatar(conversation) ? (
                        <AvatarImage src={getConversationAvatar(conversation)} />
                      ) : (
                        <AvatarFallback className={`font-semibold text-white ${
                          conversation.type === 'team' 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-br from-airsoft-red to-red-600'
                        }`}>
                          {conversation.type === 'team' ? (
                            <Users className="h-7 w-7" />
                          ) : (
                            getConversationName(conversation).charAt(0).toUpperCase()
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <div className="absolute inset-0 bg-airsoft-red rounded-full blur-sm opacity-60"></div>
                        <Badge className="relative h-6 w-6 p-0 bg-gradient-to-r from-airsoft-red to-red-600 hover:from-airsoft-red hover:to-red-600 text-white text-xs flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Online status indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-airsoft-red transition-colors text-base">
                          {getConversationName(conversation)}
                        </h3>
                        {conversation.type === 'team' && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100 px-2 py-0.5 font-medium">
                            Équipe
                          </Badge>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(conversation.lastMessage.created_at)}</span>
                        </div>
                      )}
                    </div>
                    
                    {conversation.lastMessage ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 truncate leading-relaxed">
                          <span className="font-medium text-gray-700">
                            {conversation.lastMessage.sender_name}
                          </span>
                          <Dot className="inline h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">
                            {truncateMessage(conversation.lastMessage.content)}
                          </span>
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
