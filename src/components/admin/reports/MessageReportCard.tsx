
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import MessageReportActions from './MessageReportActions';
import MessageReportProfileButtons from './MessageReportProfileButtons';

interface MessageReport {
  id: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  reporter_profile: {
    username: string;
  } | null;
  message: {
    content: string;
    conversation_id: string;
    sender_profile: {
      username: string;
    } | null;
  } | null;
}

interface MessageReportCardProps {
  report: MessageReport;
  onResolveClick: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  onViewProfile: (username: string) => void;
  onViewConversation: (conversationId: string) => void;
  isLoading: boolean;
}

const MessageReportCard: React.FC<MessageReportCardProps> = ({
  report,
  onResolveClick,
  onDismiss,
  onViewProfile,
  onViewConversation,
  isLoading
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dismissed': return <X className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            Rapport de message
          </CardTitle>
          <Badge className={getStatusBadge(report.status)}>
            {report.status === 'pending' ? 'En attente' : 
             report.status === 'resolved' ? 'Résolu' : 'Rejeté'}
          </Badge>
        </div>
        <CardDescription>
          Signalé par: {report.reporter_profile?.username || 'Utilisateur supprimé'} • {new Date(report.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Raison:</strong> {report.reason}
        </div>
        {report.details && (
          <div>
            <strong>Détails:</strong> {report.details}
          </div>
        )}
        {report.message && (
          <div className="bg-gray-50 p-3 rounded">
            <strong>Message signalé:</strong>
            <p className="mt-1">"{report.message.content}"</p>
            <p className="text-sm text-gray-600 mt-1">
              Par: {report.message.sender_profile?.username || 'Utilisateur supprimé'}
            </p>
          </div>
        )}
        {report.admin_notes && (
          <div>
            <strong>Notes admin:</strong> {report.admin_notes}
          </div>
        )}
        
        <MessageReportProfileButtons
          report={report}
          onViewProfile={onViewProfile}
          onViewConversation={onViewConversation}
        />
        
        <MessageReportActions
          report={report}
          onResolveClick={onResolveClick}
          onDismiss={onDismiss}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default MessageReportCard;
