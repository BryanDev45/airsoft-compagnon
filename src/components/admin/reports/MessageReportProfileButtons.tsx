
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, MessageSquare } from 'lucide-react';

interface MessageReport {
  id: string;
  status: string;
  reporter_profile: {
    username: string;
  } | null;
  message: {
    conversation_id: string;
    sender_profile: {
      username: string;
    } | null;
  } | null;
}

interface MessageReportProfileButtonsProps {
  report: MessageReport;
  onViewProfile: (username: string) => void;
  onViewConversation: (conversationId: string) => void;
}

const MessageReportProfileButtons: React.FC<MessageReportProfileButtonsProps> = ({
  report,
  onViewProfile,
  onViewConversation
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t">
      {report.reporter_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.reporter_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
        >
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Profil du rapporteur</span>
        </Button>
      )}
      {report.message?.sender_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.message.sender_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
        >
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Profil de l'auteur du message</span>
        </Button>
      )}
      {report.message?.conversation_id && report.status === 'pending' && (
        <Button
          onClick={() => onViewConversation(report.message.conversation_id)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
        >
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Voir la conversation</span>
        </Button>
      )}
    </div>
  );
};

export default MessageReportProfileButtons;
