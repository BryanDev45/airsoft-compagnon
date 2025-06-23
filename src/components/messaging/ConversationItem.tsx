
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick
}) => {
  // Helper function to get display name
  const getDisplayName = () => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants[0];
      return otherParticipant?.username || 'Conversation';
    }
    return conversation.name || 'Conversation d\'équipe';
  };

  // Helper function to get avatar
  const getAvatar = () => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants[0];
      return otherParticipant?.avatar;
    }
    return null;
  };

  // Helper function to get initials
  const getInitials = (name: string): string => {
    return name.substring(0, 2).toUpperCase();
  };

  // Format last message time
  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={getAvatar() || undefined} />
            <AvatarFallback>
              {getInitials(getDisplayName())}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">
              {getDisplayName()}
            </h3>
            <div className="flex items-center gap-2">
              {conversation.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatMessageTime(conversation.lastMessage.created_at)}
                </span>
              )}
              {conversation.unread_count > 0 && (
                <Badge className="bg-blue-600 text-white text-xs">
                  {conversation.unread_count}
                </Badge>
              )}
            </div>
          </div>
          
          {conversation.lastMessage && (
            <p className="text-sm text-gray-600 truncate mt-1">
              <span className="font-medium">{conversation.lastMessage.sender_name}:</span>{' '}
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
