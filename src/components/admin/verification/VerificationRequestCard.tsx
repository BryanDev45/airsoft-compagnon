
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationRequest } from '@/hooks/admin/useVerificationRequests';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { VerificationImage } from './VerificationImage';
import { VerificationActions } from './VerificationActions';

interface VerificationRequestCardProps {
  request: VerificationRequest;
  onUpdateRequest: (requestId: string, status: string, adminNotes: string) => void;
}

export const VerificationRequestCard = ({ 
  request, 
  onUpdateRequest 
}: VerificationRequestCardProps) => {
  const handleApprove = (requestId: string, status: string, adminNotes: string) => {
    onUpdateRequest(requestId, status, adminNotes);
  };

  const handleReject = (requestId: string, status: string, adminNotes: string) => {
    onUpdateRequest(requestId, status, adminNotes);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Demande de vérification
          </CardTitle>
          <VerificationStatusBadge status={request.status} />
        </div>
        <CardDescription>
          Utilisateur: {request.user_profile?.username || 'Utilisateur supprimé'} • 
          Email: {request.user_profile?.email || 'N/A'} • 
          {new Date(request.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <VerificationImage
            src={request.front_id_document}
            alt="Document d'identité recto"
            title="Document d'identité (recto)"
          />
          
          <VerificationImage
            src={request.back_id_document}
            alt="Document d'identité verso"
            title="Document d'identité (verso)"
          />

          <VerificationImage
            src={request.face_photo}
            alt="Photo du visage"
            title="Photo du visage"
          />
        </div>
        
        {request.admin_notes && (
          <div>
            <strong>Notes admin:</strong> {request.admin_notes}
          </div>
        )}
        
        <VerificationActions
          requestId={request.id}
          status={request.status}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </CardContent>
    </Card>
  );
};
