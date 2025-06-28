
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, User } from 'lucide-react';
import { useIsUserOnline } from '@/hooks/messaging/useUserPresence';

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
  // Get online status for direct conversations
  const otherParticipantId = conversation.type === 'direct' ? conversation.participants[0]?.id : undefined;
  const { data: isOnline } = useIsUserOnline(otherParticipantId);

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
      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'bg-gradient-to-r from-airsoft-red/10 to-red-600/10 border-l-4 border-airsoft-red shadow-lg scale-[1.02]' 
          : 'hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-gray-200/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className={`h-14 w-14 ring-2 transition-all duration-200 ${
            isSelected ? 'ring-airsoft-red/30 shadow-lg' : 'ring-gray-200 group-hover:ring-gray-300'
          }`}>
            <AvatarImage src={getAvatar() || undefined} />
            <AvatarFallback className={`text-white font-semibold text-sm ${
              conversation.type === 'team' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : 'bg-gradient-to-br from-gray-500 to-gray-600'
            }`}>
              {conversation.type === 'team' ? (
                <Users className="h-6 w-6" />
              ) : (
                getInitials(getDisplayName())
              )}
            </AvatarFallback>
          </Avatar>
          
          {/* Type indicator with online status for direct conversations */}
          <div className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow-sm ${
            conversation.type === 'team' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {conversation.type === 'team' ? (
              <Users className="h-3 w-3 text-white" />
            ) : (
              <User className="h-3 w-3 text-white" />
            )}
          </div>

          {/* Online status indicator for direct conversations */}
          {conversation.type === 'direct' && (
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3 className={`font-semibold truncate transition-colors ${
                isSelected ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
              }`}>
                {getDisplayName()}
              </h3>
              
              {/* Online status text for direct conversations */}
              {conversation.type === 'direct' && (
                <span className={`text-xs font-medium ${
                  isOnline ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {conversation.lastMessage && (
                <span className="text-xs text-gray-500 font-medium">
                  {formatMessageTime(conversation.lastMessage.created_at)}
                </span>
              )}
              {conversation.unread_count > 0 && (
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 shadow-sm">
                  {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                </Badge>
              )}
            </div>
          </div>
          
          {conversation.lastMessage && (
            <div className="flex items-center gap-2">
              <p className={`text-sm truncate transition-colors ${
                conversation.unread_count > 0 
                  ? 'text-gray-700 font-medium' 
                  : 'text-gray-600'
              }`}>
                <span className="font-semibold text-airsoft-red">
                  {conversation.lastMessage.sender_name}:
                </span>{' '}
                {conversation.lastMessage.content}
              </p>
            </div>
          )}
          
          {/* Conversation type badge - only show for team conversations */}
          {conversation.type === 'team' && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                Équipe
              </span>
              
              {conversation.participants.length > 1 && (
                <span className="text-xs text-gray-500">
                  {conversation.participants.length} participant{conversation.participants.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Hover effect */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-airsoft-red/5 to-red-600/5' 
          : 'bg-gradient-to-r from-transparent to-transparent group-hover:from-gray-50/50 group-hover:to-white/50'
      }`} />
    </div>
  );
};

export default ConversationItem;
