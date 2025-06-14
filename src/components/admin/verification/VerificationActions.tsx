
import React from 'react';
import { Button } from '@/components/ui/button';

interface VerificationActionsProps {
  requestId: string;
  status: string;
  onApprove: (requestId: string, status: string, adminNotes: string) => void;
  onReject: (requestId: string, status: string, adminNotes: string) => void;
}

export const VerificationActions = ({ 
  requestId, 
  status, 
  onApprove, 
  onReject 
}: VerificationActionsProps) => {
  if (status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onApprove(
          requestId, 
          'approved',
          'Documents vérifiés et approuvés'
        )}
        size="sm"
        className="bg-green-600 hover:bg-green-700"
      >
        Approuver
      </Button>
      <Button
        onClick={() => onReject(
          requestId, 
          'rejected',
          'Documents non conformes ou illisibles'
        )}
        variant="destructive"
        size="sm"
      >
        Rejeter
      </Button>
    </div>
  );
};
