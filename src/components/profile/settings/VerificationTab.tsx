
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
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

  const uploadFile = async (file: File, fileName: string): Promise<string | null> => {
    try {
      console.log(`Uploading file: ${fileName}`);
      
      const { data, error } = await supabase.storage
        .from('verification-photos')
        .upload(`${user.id}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('verification-photos')
        .getPublicUrl(`${user.id}/${fileName}`);

      console.log(`File uploaded successfully: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
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

    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Utilisateur non identifié",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      console.log('Starting verification request process...');
      
      // Upload all three files
      const timestamp = Date.now();
      const frontIdUrl = await uploadFile(
        frontIdFile, 
        `front_id_${timestamp}.${frontIdFile.name.split('.').pop()}`
      );
      const backIdUrl = await uploadFile(
        backIdFile, 
        `back_id_${timestamp}.${backIdFile.name.split('.').pop()}`
      );
      const facePhotoUrl = await uploadFile(
        facePhotoFile, 
        `face_photo_${timestamp}.${facePhotoFile.name.split('.').pop()}`
      );

      if (!frontIdUrl || !backIdUrl || !facePhotoUrl) {
        throw new Error('Erreur lors du téléchargement des fichiers');
      }

      console.log('All files uploaded successfully, creating verification request...');

      // Create verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          front_id_document: frontIdUrl,
          back_id_document: backIdUrl,
          face_photo: facePhotoUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Verification request created successfully:', data);

      setVerificationRequested(true);
      setExistingRequest(data);
      
      // Clear file inputs
      setFrontIdFile(null);
      setBackIdFile(null);
      setFacePhotoFile(null);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de vérification a été envoyée avec succès. Vous recevrez une réponse prochainement."
      });
    } catch (error: any) {
      console.error('Error submitting verification request:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande",
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
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-4 p-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <h4 className="font-medium">Vérification du compte</h4>
          </div>
          {user?.is_verified ? (
            <Badge className="bg-blue-500">Vérifié</Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-700">Non vérifié</Badge>
          )}
        </div>
        
        {user?.is_verified ? (
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
    </ScrollArea>
  );
};

export default VerificationTab;
