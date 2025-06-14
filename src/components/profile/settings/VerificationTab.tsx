
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Shield, CheckCircle2, Upload, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VerificationTabProps {
  user: any;
}

const VerificationTab = ({ user }: VerificationTabProps) => {
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [facePhotoFile, setFacePhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('verification-photos')
        .upload(`${user.id}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('verification-photos')
        .getPublicUrl(`${user.id}/${fileName}`);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleRequestVerification = async () => {
    if (!frontIdFile || !backIdFile || !facePhotoFile) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger tous les documents requis : recto et verso de la carte d'identité, ainsi qu'une photo de votre visage",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload all three files
      const frontIdUrl = await uploadFile(frontIdFile, `front_id_${Date.now()}.${frontIdFile.name.split('.').pop()}`);
      const backIdUrl = await uploadFile(backIdFile, `back_id_${Date.now()}.${backIdFile.name.split('.').pop()}`);
      const facePhotoUrl = await uploadFile(facePhotoFile, `face_photo_${Date.now()}.${facePhotoFile.name.split('.').pop()}`);

      if (!frontIdUrl || !backIdUrl || !facePhotoUrl) {
        throw new Error('Erreur lors du téléchargement des fichiers');
      }

      // Create verification request
      const { error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          front_id_document: frontIdUrl,
          back_id_document: backIdUrl,
          face_photo: facePhotoUrl,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      setVerificationRequested(true);
      toast({
        title: "Demande envoyée",
        description: "Votre demande de vérification a été envoyée avec succès. Vous recevrez un email prochainement."
      });
    } catch (error) {
      console.error('Error submitting verification request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
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

  const handleFacePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFacePhotoFile(e.target.files[0]);
    }
  };

  const triggerFileInput = (inputId: string) => {
    document.getElementById(inputId)?.click();
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
            La vérification de compte permet de garantir votre identité et d'obtenir un badge de vérification sur votre profil. Pour être vérifié, nous avons besoin de votre carte d'identité et d'une photo de votre visage.
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
                  className="hidden"
                />
                <div 
                  onClick={() => triggerFileInput('front-id')}
                  className="cursor-pointer text-center py-4"
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {frontIdFile ? frontIdFile.name : "Cliquez pour télécharger le recto"}
                  </p>
                </div>
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
                  className="hidden"
                />
                <div 
                  onClick={() => triggerFileInput('back-id')}
                  className="cursor-pointer text-center py-4"
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {backIdFile ? backIdFile.name : "Cliquez pour télécharger le verso"}
                  </p>
                </div>
                {backIdFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    {backIdFile.name} ({Math.round(backIdFile.size / 1024)} Ko)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="face-photo" className="flex items-center gap-1">
                <Camera size={16} /> Photo de votre visage
              </Label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <Input 
                  id="face-photo" 
                  type="file" 
                  accept="image/*"
                  capture="user"
                  onChange={handleFacePhotoChange}
                  className="hidden"
                />
                <div 
                  onClick={() => triggerFileInput('face-photo')}
                  className="cursor-pointer text-center py-4"
                >
                  <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {facePhotoFile ? facePhotoFile.name : "Cliquez pour prendre une photo ou sélectionner depuis la galerie"}
                  </p>
                </div>
                {facePhotoFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    {facePhotoFile.name} ({Math.round(facePhotoFile.size / 1024)} Ko)
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Vos documents d'identité et votre photo seront traités et supprimés de nos serveurs après vérification. Ils ne seront jamais partagés avec des tiers.
            </p>
          </div>
          
          <Button 
            onClick={handleRequestVerification} 
            className="w-full bg-airsoft-red hover:bg-red-700 mt-4"
            disabled={!frontIdFile || !backIdFile || !facePhotoFile || uploading}
          >
            {uploading ? "Envoi en cours..." : "Demander une vérification"}
          </Button>
        </>
      )}
    </div>
  );
};

export default VerificationTab;
