
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useFileUpload } from './useFileUpload';
import { generateFileName } from '@/utils/fileValidation';

interface UseVerificationSubmissionProps {
  user: any;
  onVerificationRequested: (request: any) => void;
  onFilesCleared: () => void;
}

export const useVerificationSubmission = ({ 
  user, 
  onVerificationRequested, 
  onFilesCleared 
}: UseVerificationSubmissionProps) => {
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useFileUpload();

  const handleRequestVerification = async (
    frontIdFile: File | null,
    backIdFile: File | null,
    facePhotoFile: File | null
  ) => {
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
      
      // Verify Supabase connection
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser.user) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      // Upload files with individual error handling
      const timestamp = Date.now();
      let frontIdPath: string | null = null;
      let backIdPath: string | null = null;
      let facePhotoPath: string | null = null;

      try {
        frontIdPath = await uploadFile(
          frontIdFile, 
          generateFileName(frontIdFile, 'front_id', timestamp),
          user.id
        );
      } catch (error: any) {
        throw new Error(`Erreur lors de l'upload du recto: ${error.message}`);
      }

      try {
        backIdPath = await uploadFile(
          backIdFile, 
          generateFileName(backIdFile, 'back_id', timestamp),
          user.id
        );
      } catch (error: any) {
        throw new Error(`Erreur lors de l'upload du verso: ${error.message}`);
      }

      try {
        facePhotoPath = await uploadFile(
          facePhotoFile, 
          generateFileName(facePhotoFile, 'face_photo', timestamp),
          user.id
        );
      } catch (error: any) {
        throw new Error(`Erreur lors de l'upload de la photo: ${error.message}`);
      }

      if (!frontIdPath || !backIdPath || !facePhotoPath) {
        throw new Error('Erreur lors du téléchargement des fichiers');
      }

      console.log('All files uploaded successfully, creating verification request...');

      // Create verification request
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
      onFilesCleared();
      
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

  return {
    uploading,
    handleRequestVerification
  };
};
