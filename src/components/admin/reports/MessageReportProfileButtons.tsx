
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
    <div className="flex items-center gap-2 pt-2 border-t">
      {report.reporter_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.reporter_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Profil du rapporteur
        </Button>
      )}
      {report.message?.sender_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.message.sender_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Profil de l'auteur du message
        </Button>
      )}
      {report.message?.conversation_id && report.status === 'pending' && (
        <Button
          onClick={() => onViewConversation(report.message.conversation_id)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Voir la conversation
        </Button>
      )}
    </div>
  );
};

export default MessageReportProfileButtons;
