
import React from 'react';
import { Button } from '@/components/ui/button';

interface MessageReport {
  id: string;
  status: string;
}

interface MessageReportActionsProps {
  report: MessageReport;
  onResolveClick: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  isLoading: boolean;
}

const MessageReportActions: React.FC<MessageReportActionsProps> = ({
  report,
  onResolveClick,
  onDismiss,
  isLoading
}) => {
  if (report.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onResolveClick(report.id)}
        size="sm"
        className="bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        Résoudre
      </Button>
      <Button
        onClick={() => onDismiss(report.id)}
        variant="outline"
        size="sm"
        disabled={isLoading}
      >
        Rejeter
      </Button>
    </div>
  );
};

export default MessageReportActions;
