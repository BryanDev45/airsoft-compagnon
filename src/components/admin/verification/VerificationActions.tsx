
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VerificationRejectDialog } from './VerificationRejectDialog';

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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  if (status !== 'pending') {
    return null;
  }

  const handleApprove = () => {
    onApprove(
      requestId, 
      'approved',
      'Documents vérifiés et approuvés'
    );
  };

  const handleRejectConfirm = (reason: string) => {
    onReject(
      requestId, 
      'rejected',
      reason
    );
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          Approuver
        </Button>
        <Button
          onClick={() => setRejectDialogOpen(true)}
          variant="destructive"
          size="sm"
        >
          Rejeter
        </Button>
      </div>

      <VerificationRejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
      />
    </>
  );
};
