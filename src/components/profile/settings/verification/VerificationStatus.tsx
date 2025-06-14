
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
  const getBadgeVariant = () => {
    if (isVerified) {
      return { text: "Vérifié", className: "bg-blue-500 text-white" };
    }
    
    if (verificationRequested || (existingRequest && existingRequest.status === 'pending')) {
      return { text: "En attente", className: "bg-yellow-500 text-white" };
    }
    
    return { text: "Non vérifié", className: "bg-red-500 text-white" };
  };

  const badge = getBadgeVariant();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} />
          <h4 className="font-medium">Vérification du compte</h4>
        </div>
        <Badge className={badge.className}>
          {badge.text}
        </Badge>
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
