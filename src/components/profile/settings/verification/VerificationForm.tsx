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
      console.log(`Uploading file: ${fileName}, size: ${file.size} bytes`);
      
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Le fichier ${fileName} est trop volumineux (max 10MB)`);
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Type de fichier non autorisé: ${file.type}. Utilisez JPG, PNG ou WebP.`);
      }
      
      const filePath = `${user.id}/${fileName}`;
      console.log(`File path: ${filePath}`);
      
      // Tenter l'upload avec une gestion d'erreur détaillée
      const { data, error } = await supabase.storage
        .from('verification-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Detailed upload error:', {
          message: error.message,
          statusCode: error.statusCode,
          error: error
        });
        
        // Messages d'erreur plus spécifiques
        if (error.message.includes('Bucket not found')) {
          throw new Error('Erreur de configuration du stockage. Veuillez contacter l\'administrateur.');
        } else if (error.message.includes('not allowed')) {
          throw new Error('Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.');
        } else if (error.message.includes('too large')) {
          throw new Error('Fichier trop volumineux. Taille maximum: 10MB.');
        } else {
          throw new Error(`Erreur d'upload: ${error.message}`);
        }
      }

      console.log(`File uploaded successfully:`, data);
      return filePath;
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
      
      // Vérifier la connexion à Supabase
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser.user) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      // Upload des fichiers avec gestion d'erreur individuelle
      const timestamp = Date.now();
      let frontIdPath: string | null = null;
      let backIdPath: string | null = null;
      let facePhotoPath: string | null = null;

      try {
        frontIdPath = await uploadFile(
          frontIdFile, 
          `front_id_${timestamp}.${frontIdFile.name.split('.').pop()}`
        );
      } catch (error) {
        throw new Error(`Erreur lors de l'upload du recto: ${error.message}`);
      }

      try {
        backIdPath = await uploadFile(
          backIdFile, 
          `back_id_${timestamp}.${backIdFile.name.split('.').pop()}`
        );
      } catch (error) {
        throw new Error(`Erreur lors de l'upload du verso: ${error.message}`);
      }

      try {
        facePhotoPath = await uploadFile(
          facePhotoFile, 
          `face_photo_${timestamp}.${facePhotoFile.name.split('.').pop()}`
        );
      } catch (error) {
        throw new Error(`Erreur lors de l'upload de la photo: ${error.message}`);
      }

      if (!frontIdPath || !backIdPath || !facePhotoPath) {
        throw new Error('Erreur lors du téléchargement des fichiers');
      }

      console.log('All files uploaded successfully, creating verification request...');

      // Créer la demande de vérification
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          front_id_document: frontIdPath,
          back_id_document: backIdPath,
          face_photo: facePhotoPath,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
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
