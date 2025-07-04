
import React from 'react';
import { useVerificationRequests } from '@/hooks/admin/useVerificationRequests';
import { VerificationRequestCard } from './verification/VerificationRequestCard';
import { VerificationRequestsEmpty } from './verification/VerificationRequestsEmpty';

const VerificationRequestsTab = () => {
  const { requests, isLoading, updateRequest } = useVerificationRequests();

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des demandes...</div>;
  }

  const handleUpdateRequest = (requestId: string, status: string, adminNotes: string) => {
    updateRequest({ requestId, status, adminNotes });
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <VerificationRequestCard
          key={request.id}
          request={request}
          onUpdateRequest={handleUpdateRequest}
        />
      ))}
      {requests.length === 0 && <VerificationRequestsEmpty />}
    </div>
  );
};

export default VerificationRequestsTab;
