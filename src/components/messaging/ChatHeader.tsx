
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical, Users } from 'lucide-react';
import { ConversationDetails } from '@/types/messaging';
import { useAuth } from '@/hooks/useAuth';

interface ChatHeaderProps {
  conversation?: ConversationDetails;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
  const { user } = useAuth();

  const getConversationTitle = () => {
    if (conversation?.type === 'team' && conversation.name) {
      return conversation.name;
    }
    const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
    return otherParticipant?.username || 'Conversation';
  };

  const getConversationAvatar = () => {
    if (conversation?.type === 'team') {
      return null;
    }
    const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
    return otherParticipant?.avatar;
  };

  const getConversationAvatarFallback = () => {
    if (conversation?.type === 'team') {
      return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg w-full h-full flex items-center justify-center">
          <Users className="h-7 w-7" />
        </div>
      );
    }
    const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
    const displayName = otherParticipant?.username || 'Utilisateur';
    return (
      <div className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg w-full h-full flex items-center justify-center">
        {displayName.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden hover:bg-gray-100 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
          <AvatarImage src={getConversationAvatar()} />
          <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg">
            {getConversationAvatarFallback()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="font-bold text-gray-900 text-xl">{getConversationTitle()}</h2>
          <p className="text-sm text-green-600 font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            En ligne
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full h-12 w-12">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
