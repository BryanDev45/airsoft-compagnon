
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  MessageSquare, 
  User, 
  Calendar, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ResponsiveReportCardProps {
  report: any;
  type: 'user' | 'message';
  onResolveClick: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  onViewProfile: (username: string) => void;
  onViewConversation?: (conversationId: string) => void;
  isLoading: boolean;
}

const ResponsiveReportCard: React.FC<ResponsiveReportCardProps> = ({
  report,
  type,
  onResolveClick,
  onDismiss,
  onViewProfile,
  onViewConversation,
  isLoading
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'dismissed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'spam': return 'bg-orange-100 text-orange-800';
      case 'harassment': return 'bg-red-100 text-red-800';
      case 'inappropriate': return 'bg-purple-100 text-purple-800';
      case 'fake_profile': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {type === 'user' ? (
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              ) : (
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Badge className={`text-xs px-2 py-1 ${getReasonColor(report.reason)}`}>
                  {report.reason}
                </Badge>
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(report.status)}`}>
                  {report.status === 'pending' ? 'En attente' : 
                   report.status === 'resolved' ? 'Résolu' : 'Rejeté'}
                </Badge>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">
                  {formatDistanceToNow(new Date(report.created_at), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {/* Détails du signalement */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="font-medium text-gray-700">Signalé par :</span>
              <div className="mt-1">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs sm:text-sm font-normal text-blue-600"
                  onClick={() => onViewProfile(report.reporter_profile?.username || '')}
                >
                  @{report.reporter_profile?.username || 'Utilisateur supprimé'}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>

            {type === 'user' && report.reported_profile && (
              <div>
                <span className="font-medium text-gray-700">Utilisateur signalé :</span>
                <div className="mt-1">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs sm:text-sm font-normal text-blue-600"
                    onClick={() => onViewProfile(report.reported_profile?.username || '')}
                  >
                    @{report.reported_profile?.username || 'Utilisateur supprimé'}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {type === 'message' && report.message && (
              <div>
                <span className="font-medium text-gray-700">Expéditeur :</span>
                <div className="mt-1">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs sm:text-sm font-normal text-blue-600"
                    onClick={() => onViewProfile(report.message.sender_profile?.username || '')}
                  >
                    @{report.message.sender_profile?.username || 'Utilisateur supprimé'}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {report.details && (
            <div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Détails :</span>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 break-words">
                {report.details}
              </p>
            </div>
          )}

          {type === 'message' && report.message && (
            <div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Message signalé :</span>
              <div className="mt-1 p-2 sm:p-3 bg-gray-50 rounded-md">
                <p className="text-xs sm:text-sm text-gray-800 break-words">
                  {report.message.content}
                </p>
              </div>
            </div>
          )}

          {report.admin_notes && (
            <div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Notes admin :</span>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 break-words">
                {report.admin_notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {report.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3 border-t">
            <Button
              onClick={() => onResolveClick(report.id)}
              disabled={isLoading}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Résoudre</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => onDismiss(report.id)}
              disabled={isLoading}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <XCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Rejeter</span>
            </Button>

            {type === 'message' && report.message && onViewConversation && (
              <Button
                variant="secondary"
                onClick={() => onViewConversation(report.message.conversation_id)}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Voir conversation</span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveReportCard;
