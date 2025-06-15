import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import UserReportActions from './UserReportActions';
import UserReportProfileButtons from './UserReportProfileButtons';

interface UserReport {
  id: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  reporter_profile: {
    username: string;
  } | null;
  reported_profile: {
    username: string;
  } | null;
}

interface UserReportCardProps {
  report: UserReport;
  onResolveClick: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  onViewProfile: (username: string) => void;
  onWarnClick: (report: UserReport) => void;
  isLoading: boolean;
}

const UserReportCard: React.FC<UserReportCardProps> = ({
  report,
  onResolveClick,
  onDismiss,
  onViewProfile,
  onWarnClick,
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
      dismissed: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            Rapport d'utilisateur
          </CardTitle>
          <Badge className={getStatusBadge(report.status)}>
            {report.status === 'pending' ? 'En attente' : 
             report.status === 'resolved' ? 'Résolu' : 'Rejeté'}
          </Badge>
        </div>
        <CardDescription>
          Signalé par: {report.reporter_profile?.username || 'Utilisateur supprimé'} • 
          Utilisateur signalé: {report.reported_profile?.username || 'Utilisateur supprimé'} • 
          {new Date(report.created_at).toLocaleDateString()}
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
        {report.admin_notes && (
          <div>
            <strong>Notes admin:</strong> {report.admin_notes}
          </div>
        )}
        
        <UserReportProfileButtons
          report={report}
          onViewProfile={onViewProfile}
        />
        
        <UserReportActions
          report={report}
          onResolveClick={onResolveClick}
          onDismiss={onDismiss}
          onWarnClick={onWarnClick}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default UserReportCard;
