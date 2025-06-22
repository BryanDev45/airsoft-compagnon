
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Conversation } from '@/types/messaging';
import { Users, MessageCircle } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  onSelect: (conversationId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onSelect
}) => {
  const handleClick = () => {
    onSelect(conversation.id);
  };

  const getConversationTitle = () => {
    if (conversation.name) {
      return conversation.name;
    }
    
    if (conversation.type === 'team') {
      return 'Équipe';
    }
    
    if (conversation.participants && conversation.participants.length > 0) {
      return conversation.participants.map(p => p.username).join(', ');
    }
    
    return 'Conversation';
  };

  const getInitials = (title: string) => {
    return title.substring(0, 2).toUpperCase();
  };

  const getLastMessageTime = () => {
    if (!conversation.lastMessage?.created_at) return '';
    
    try {
      return formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return '';
    }
  };

  const getParticipantAvatar = () => {
    if (conversation.participants && conversation.participants.length > 0) {
      return conversation.participants[0].avatar;
    }
    return null;
  };

  return (
    <div 
      className="group overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-airsoft-red bg-gradient-to-r from-white to-gray-50/50 rounded-lg shadow-sm cursor-pointer p-4"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
            <AvatarImage 
              src={getParticipantAvatar() || ""} 
              alt={getConversationTitle()} 
            />
            <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold">
              {getInitials(getConversationTitle())}
            </AvatarFallback>
          </Avatar>
          
          {conversation.type === 'team' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
              <Users className="h-3 w-3 text-blue-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold truncate transition-colors duration-200 text-gray-900 group-hover:text-airsoft-red">
              {getConversationTitle()}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {conversation.unread_count > 0 && (
                <Badge className="bg-airsoft-red text-white text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {conversation.unread_count}
                </Badge>
              )}
              {getLastMessageTime() && (
                <span className="text-xs text-gray-500">
                  {getLastMessageTime()}
                </span>
              )}
            </div>
          </div>
          
          {conversation.lastMessage ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 flex-shrink-0">
                {conversation.lastMessage.sender_name}:
              </span>
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage.content}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle className="h-3 w-3" />
              <span>Nouvelle conversation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
