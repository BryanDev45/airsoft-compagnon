
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types/messaging';
import { formatTime } from '@/utils/messaging';
import { useAuth } from '@/hooks/useAuth';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender_id === user?.id;

  return (
    <div className={`flex gap-4 w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <Avatar className="h-10 w-10 ring-2 ring-gray-200 shadow-sm flex-shrink-0">
          <AvatarImage src={message.sender_avatar} />
          <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-sm font-medium">
            {message.sender_name[0]}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className={`relative rounded-3xl px-6 py-4 shadow-lg transition-all duration-200 hover:shadow-xl ${isOwnMessage ? 'bg-gradient-to-r from-airsoft-red to-red-600 text-white' : 'bg-white text-gray-900 border border-gray-100'}`}>
          <div className={`absolute top-4 w-4 h-4 transform rotate-45 ${isOwnMessage ? 'bg-gradient-to-br from-airsoft-red to-red-600 -right-2' : 'bg-white border-r border-b border-gray-100 -left-2'}`}></div>
          <p className="text-base leading-relaxed relative z-10 break-words">{message.content}</p>
        </div>
        
        <div className={`text-xs text-gray-500 mt-3 flex items-center gap-2 px-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-semibold">{message.sender_name}</span>
          <span>•</span>
          <span>{formatTime(message.created_at)}</span>
          {isOwnMessage && <span className="text-green-600 font-bold text-sm">✓✓</span>}
        </div>
      </div>
      
      {isOwnMessage && (
        <Avatar className="h-10 w-10 ring-2 ring-red-200 shadow-sm flex-shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-medium text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;
