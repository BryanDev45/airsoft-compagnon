
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import DocumentUpload from './DocumentUpload';

interface VerificationFormProps {
  user: any;
  onVerificationRequested: (request: any) => void;
}

const VerificationForm = ({ user, onVerificationRequested }: VerificationFormProps) => {
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [facePhotoFile, setFacePhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

      onVerificationRequested(data);
      
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

  return (
    <>
      <p className="text-sm text-gray-500">
        La vérification de compte permet de garantir votre identité et d'obtenir un badge de vérification sur votre profil. Pour être vérifié, nous avons besoin de votre carte d'identité et d'une photo de votre visage.
      </p>
      
      <div className="space-y-4 mt-4">
        <DocumentUpload
          id="front-id"
          label="Recto de votre carte d'identité"
          icon="upload"
          file={frontIdFile}
          onChange={handleFrontIdChange}
          placeholder="Cliquez pour télécharger le recto"
        />
        
        <DocumentUpload
          id="back-id"
          label="Verso de votre carte d'identité"
          icon="upload"
          file={backIdFile}
          onChange={handleBackIdChange}
          placeholder="Cliquez pour télécharger le verso"
        />

        <DocumentUpload
          id="face-photo"
          label="Photo de votre visage"
          icon="camera"
          file={facePhotoFile}
          onChange={handleFacePhotoChange}
          placeholder="Cliquez pour prendre une photo ou sélectionner depuis la galerie"
          capture="user"
        />
        
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
  );
};

export default VerificationForm;
