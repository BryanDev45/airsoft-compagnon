
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

  const formatBirthDate = (birthDate: string | null) => {
    if (!birthDate) return 'Non renseignée';
    return new Date(birthDate).toLocaleDateString('fr-FR');
  };

  const getFullName = () => {
    const { firstname, lastname } = request.user_profile || {};
    if (firstname && lastname) {
      return `${firstname} ${lastname}`;
    }
    if (firstname) return firstname;
    if (lastname) return lastname;
    return 'Non renseigné';
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
          <div className="space-y-1">
            <div>
              <strong>Utilisateur:</strong> {request.user_profile?.username || 'Utilisateur supprimé'} • 
              <strong> Email:</strong> {request.user_profile?.email || 'N/A'}
            </div>
            <div>
              <strong>Nom complet:</strong> {getFullName()}
            </div>
            <div>
              <strong>Date de naissance:</strong> {formatBirthDate(request.user_profile?.birth_date)}
            </div>
            <div>
              <strong>Date de demande:</strong> {new Date(request.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <VerificationImage
            src={request.frontIdUrl}
            alt="Document d'identité recto"
            title="Document d'identité (recto)"
          />
          
          <VerificationImage
            src={request.backIdUrl}
            alt="Document d'identité verso"
            title="Document d'identité (verso)"
          />

          <VerificationImage
            src={request.facePhotoUrl}
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
