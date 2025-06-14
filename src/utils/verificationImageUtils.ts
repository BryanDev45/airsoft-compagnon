
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a signed URL for a verification photo stored in private bucket
 */
export const getVerificationImageSignedUrl = async (filePath: string): Promise<string | null> => {
  try {
    if (!filePath) return null;
    
    // If it's already a full URL (for backward compatibility), return as is
    if (filePath.startsWith('http')) return filePath;
    
    console.log(`Generating signed URL for: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('verification-photos')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    
    console.log(`Signed URL generated successfully: ${data.signedUrl}`);
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getVerificationImageSignedUrl:', error);
    return null;
  }
};

/**
 * Generate signed URLs for multiple verification images
 */
export const getVerificationImagesSignedUrls = async (
  frontIdPath?: string,
  backIdPath?: string,
  facePhotoPath?: string
): Promise<{
  frontIdUrl: string | null;
  backIdUrl: string | null;
  facePhotoUrl: string | null;
}> => {
  const [frontIdUrl, backIdUrl, facePhotoUrl] = await Promise.all([
    frontIdPath ? getVerificationImageSignedUrl(frontIdPath) : null,
    backIdPath ? getVerificationImageSignedUrl(backIdPath) : null,
    facePhotoPath ? getVerificationImageSignedUrl(facePhotoPath) : null,
  ]);

  return {
    frontIdUrl,
    backIdUrl,
    facePhotoUrl,
  };
};
