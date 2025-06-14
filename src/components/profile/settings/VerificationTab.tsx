
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/client';
import VerificationStatus from './verification/VerificationStatus';
import VerificationForm from './verification/VerificationForm';

interface VerificationTabProps {
  user: any;
}

const VerificationTab = ({ user }: VerificationTabProps) => {
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  // Vérifier s'il existe déjà une demande de vérification
  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('verification_requests')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking existing request:', error);
          return;
        }

        if (data) {
          setExistingRequest(data);
          setVerificationRequested(data.status === 'pending');
        }
      } catch (error) {
        console.error('Error checking existing verification request:', error);
      }
    };

    checkExistingRequest();
  }, [user?.id]);

  const handleVerificationRequested = (request: any) => {
    setVerificationRequested(true);
    setExistingRequest(request);
  };

  return (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-4 p-1">
        <VerificationStatus 
          isVerified={user?.is_verified}
          verificationRequested={verificationRequested}
          existingRequest={existingRequest}
        />
        
        {!user?.is_verified && !verificationRequested && (!existingRequest || existingRequest?.status === 'rejected') && (
          <VerificationForm 
            user={user}
            onVerificationRequested={handleVerificationRequested}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default VerificationTab;
