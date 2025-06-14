
import { supabase } from '@/integrations/supabase/client';

/**
 * Extract relative file path from a full Supabase public URL
 */
const extractFilePathFromUrl = (url: string): string | null => {
  try {
    // Pattern for Supabase storage URLs: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlPattern = /\/storage\/v1\/object\/public\/verification-photos\/(.+)$/;
    const match = url.match(urlPattern);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
};

/**
 * Check if a string is a full URL (old format)
 */
const isFullUrl = (path: string): boolean => {
  return path.startsWith('http://') || path.startsWith('https://');
};

/**
 * Generate a signed URL for a verification photo stored in private bucket
 */
export const getVerificationImageSignedUrl = async (filePath: string): Promise<string | null> => {
  try {
    if (!filePath) return null;
    
    let actualFilePath = filePath;
    
    // If it's a full URL (old format), extract the relative path
    if (isFullUrl(filePath)) {
      console.log(`Extracting file path from old URL: ${filePath}`);
      const extractedPath = extractFilePathFromUrl(filePath);
      if (!extractedPath) {
        console.error('Could not extract file path from URL:', filePath);
        return null;
      }
      actualFilePath = extractedPath;
      console.log(`Extracted file path: ${actualFilePath}`);
    }
    
    console.log(`Generating signed URL for: ${actualFilePath}`);
    
    const { data, error } = await supabase.storage
      .from('verification-photos')
      .createSignedUrl(actualFilePath, 3600); // 1 hour expiry
    
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
