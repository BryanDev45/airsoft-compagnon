
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
      return undefined; // Forcer le fallback pour les équipes
    }
    const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
    return otherParticipant?.avatar;
  };

  const renderAvatarContent = () => {
    if (conversation?.type === 'team') {
      // Pour les conversations d'équipe, afficher l'icône Users
      return <Users className="h-6 w-6 md:h-7 md:w-7" />;
    } else {
      // Pour les conversations directes, afficher les initiales de l'interlocuteur
      const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
      const displayName = otherParticipant?.username || 'U';
      return displayName.charAt(0).toUpperCase();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm">
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="lg:hidden hover:bg-gray-100 rounded-full flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-white shadow-lg flex-shrink-0">
          {conversation?.type !== 'team' && <AvatarImage src={getConversationAvatar()} />}
          <AvatarFallback className={`text-white font-semibold text-sm md:text-lg ${
            conversation?.type === 'team' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-gradient-to-br from-airsoft-red to-red-600'
          }`}>
            {renderAvatarContent()}
          </AvatarFallback>
        </Avatar>
        
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-gray-900 text-lg md:text-xl truncate">{getConversationTitle()}</h2>
          <p className="text-xs md:text-sm text-green-600 font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            En ligne
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full h-10 w-10 md:h-12 md:w-12">
          <MoreVertical className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
