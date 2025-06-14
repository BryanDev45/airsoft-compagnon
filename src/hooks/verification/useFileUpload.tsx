
import { supabase } from '@/integrations/supabase/client';
import { validateFile } from '@/utils/fileValidation';

export const useFileUpload = () => {
  const uploadFile = async (file: File, fileName: string, userId: string): Promise<string | null> => {
    try {
      console.log(`Uploading file: ${fileName}, size: ${file.size} bytes`);
      
      validateFile(file, fileName);
      
      const filePath = `${userId}/${fileName}`;
      console.log(`File path: ${filePath}`);
      
      const { data, error } = await supabase.storage
        .from('verification-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Detailed upload error:', {
          message: error.message,
          error: error
        });
        
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

  return { uploadFile };
};
