
import { supabase } from '@/integrations/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * Helper function to call Supabase RPC functions with type safety
 */
export const callRPC = async <T>(
  functionName: string, 
  params: Record<string, any> = {}
): Promise<{data: T | null, error: Error | null}> => {
  try {
    // Cast the function name to any to bypass TypeScript's limited function name type checking
    const result = await supabase.rpc(functionName as any, params);
    
    return { 
      data: result.data as T, 
      error: result.error as Error 
    };
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};

/**
 * Create a new airsoft game in the database
 */
export const createAirsoftGame = async (gameData: any) => {
  try {
    const { data, error } = await supabase
      .from('airsoft_games')
      .insert([gameData])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating airsoft game:', error);
    return { data: null, error };
  }
};

/**
 * Upload game images to storage and return their public URLs
 */
export const uploadGameImages = async (gameId: string, images: File[]) => {
  try {
    const imageUrls: string[] = [];
    
    for (let i = 0; i < Math.min(images.length, 5); i++) {
      const image = images[i];
      const fileExt = image.name.split('.').pop();
      const fileName = `${gameId}_${i + 1}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `game-images/${fileName}`;
      
      // Upload the image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('games')
        .upload(filePath, image);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('games')
        .getPublicUrl(filePath);
        
      if (publicUrlData) {
        imageUrls.push(publicUrlData.publicUrl);
      }
    }
    
    return { data: imageUrls, error: null };
  } catch (error) {
    console.error('Error uploading game images:', error);
    return { data: null, error };
  }
};
