
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
  const [isProcessing, setIsProcessing] = useState(false);

  if (status !== 'pending') {
    return null;
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(
        requestId, 
        'approved',
        'Documents vérifiés et approuvés'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    setIsProcessing(true);
    try {
      await onReject(requestId, 'rejected', reason);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          disabled={isProcessing}
        >
          {isProcessing ? "Traitement..." : "Approuver"}
        </Button>
        <Button
          onClick={() => setRejectDialogOpen(true)}
          variant="destructive"
          size="sm"
          disabled={isProcessing}
        >
          Rejeter
        </Button>
      </div>

      <VerificationRejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        isLoading={isProcessing}
      />
    </>
  );
};
