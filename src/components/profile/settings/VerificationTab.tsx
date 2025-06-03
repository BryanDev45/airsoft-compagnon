
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Shield, CheckCircle2, Upload } from 'lucide-react';

interface VerificationTabProps {
  user: any;
}

const VerificationTab = ({ user }: VerificationTabProps) => {
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);

  const handleRequestVerification = () => {
    if (!frontIdFile || !backIdFile) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger les deux côtés de votre carte d'identité",
        variant: "destructive"
      });
      return;
    }

    setVerificationRequested(true);
    toast({
      title: "Demande envoyée",
      description: "Votre demande de vérification a été envoyée avec succès. Vous recevrez un email prochainement."
    });
  };

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontIdFile(e.target.files[0]);
    }
  };

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackIdFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} />
          <h4 className="font-medium">Vérification du compte</h4>
        </div>
        {user.verified ? (
          <Badge className="bg-blue-500">Vérifié</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">Non vérifié</Badge>
        )}
      </div>
      
      {user.verified ? (
        <Alert className="bg-blue-50 border-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Votre compte est vérifié. Votre badge de vérification est visible sur votre profil.
          </AlertDescription>
        </Alert>
      ) : verificationRequested ? (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription>
            Votre demande de vérification est en cours de traitement. Vous recevrez un email lorsque votre compte sera vérifié.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            La vérification de compte permet de garantir votre identité et d'obtenir un badge de vérification sur votre profil. Pour être vérifié, nous avons besoin d'une preuve d'identité.
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="front-id" className="flex items-center gap-1">
                <Upload size={16} /> Recto de votre carte d'identité
              </Label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <Input 
                  id="front-id" 
                  type="file" 
                  accept="image/*"
                  onChange={handleFrontIdChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-airsoft-red file:text-white hover:file:bg-red-700"
                />
                {frontIdFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    {frontIdFile.name} ({Math.round(frontIdFile.size / 1024)} Ko)
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="back-id" className="flex items-center gap-1">
                <Upload size={16} /> Verso de votre carte d'identité
              </Label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <Input 
                  id="back-id" 
                  type="file" 
                  accept="image/*"
                  onChange={handleBackIdChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-airsoft-red file:text-white hover:file:bg-red-700"
                />
                {backIdFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    {backIdFile.name} ({Math.round(backIdFile.size / 1024)} Ko)
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Vos documents d'identité seront traités et supprimés de nos serveurs après vérification. Ils ne seront jamais partagés avec des tiers.
            </p>
          </div>
          
          <Button 
            onClick={handleRequestVerification} 
            className="w-full bg-airsoft-red hover:bg-red-700 mt-4"
            disabled={!frontIdFile || !backIdFile}
          >
            Demander une vérification
          </Button>
        </>
      )}
    </div>
  );
};

export default VerificationTab;
