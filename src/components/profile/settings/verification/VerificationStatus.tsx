
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle2 } from 'lucide-react';

interface VerificationStatusProps {
  isVerified: boolean;
  verificationRequested: boolean;
  existingRequest: any;
}

const VerificationStatus = ({ isVerified, verificationRequested, existingRequest }: VerificationStatusProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} />
          <h4 className="font-medium">Vérification du compte</h4>
        </div>
        {isVerified ? (
          <Badge className="bg-blue-500">Vérifié</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">Non vérifié</Badge>
        )}
      </div>
      
      {isVerified ? (
        <Alert className="bg-blue-50 border-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Votre compte est vérifié. Votre badge de vérification est visible sur votre profil.
          </AlertDescription>
        </Alert>
      ) : verificationRequested || existingRequest ? (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription>
            {existingRequest?.status === 'rejected' 
              ? 'Votre demande de vérification a été rejetée. Vous pouvez soumettre une nouvelle demande.'
              : 'Votre demande de vérification est en cours de traitement. Vous recevrez une réponse lorsque votre compte sera vérifié.'
            }
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  );
};

export default VerificationStatus;
