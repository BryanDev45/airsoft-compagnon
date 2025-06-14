
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Dot } from 'lucide-react';
import { Conversation } from '@/types/messaging';
import { formatTime, truncateMessage, getConversationName, getConversationAvatar } from '@/utils/messaging';

interface ConversationItemProps {
  conversation: Conversation;
  onSelect: (conversationId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onSelect
}) => {
  return (
    <Button
      variant="ghost"
      className="w-full h-auto p-0 justify-start hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 group border border-transparent hover:border-blue-100/60 bg-white/40 backdrop-blur-sm"
      onClick={() => onSelect(conversation.id)}
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
  );
};

export default ConversationItem;
