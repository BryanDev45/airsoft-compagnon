
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
 * Ensure the 'games' bucket exists in Supabase Storage
 */
export const ensureGamesBucketExists = async () => {
  try {
    // Vérifier si le bucket 'games' existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Erreur lors de la vérification des buckets:", listError);
      return { success: false, error: listError };
    }
    
    // Si le bucket existe déjà, on retourne simplement success
    if (buckets?.some(bucket => bucket.name === 'games')) {
      console.log("Le bucket 'games' existe déjà");
      return { success: true };
    }
    
    // Le bucket n'existe pas, on le crée
    console.log("Le bucket 'games' n'existe pas, création en cours...");
    const { error: createError } = await supabase.storage.createBucket('games', {
      public: true // Rendre le bucket public pour accéder aux images
    });
    
    if (createError) {
      console.error("Erreur lors de la création du bucket 'games':", createError);
      return { success: false, error: createError };
    }
    
    console.log("Bucket 'games' créé avec succès");
    return { success: true };
  } catch (error) {
    console.error("Erreur inattendue lors de la vérification/création du bucket:", error);
    return { success: false, error };
  }
};

/**
 * Upload game images to storage and return their public URLs
 */
export const uploadGameImages = async (gameId: string, images: File[]) => {
  try {
    const imageUrls: string[] = [];
    
    console.log(`Début de l'upload de ${images.length} images pour le jeu ${gameId}`);
    
    // S'assurer que le bucket 'games' existe
    const bucketResult = await ensureGamesBucketExists();
    if (!bucketResult.success) {
      return { data: null, error: bucketResult.error };
    }
    
    // Télécharger jusqu'à 5 images
    for (let i = 0; i < Math.min(images.length, 5); i++) {
      const image = images[i];
      const fileExt = image.name.split('.').pop();
      const fileName = `${gameId}_${i + 1}_${Date.now()}.${fileExt}`;
      
      console.log(`Uploading image ${i + 1}/${images.length}: ${fileName}`);
      
      // Upload the image to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('games')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error(`Erreur lors de l'upload de l'image ${fileName}:`, uploadError);
        continue; // Continue with next image instead of failing completely
      }
      
      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('games')
        .getPublicUrl(fileName);
      
      if (publicUrlData && publicUrlData.publicUrl) {
        console.log(`Image téléchargée avec succès: ${publicUrlData.publicUrl}`);
        imageUrls.push(publicUrlData.publicUrl);
      } else {
        console.error(`Impossible d'obtenir l'URL publique pour ${fileName}`);
      }
    }
    
    console.log(`${imageUrls.length} images téléchargées avec succès:`, imageUrls);
    return { data: imageUrls, error: null };
  } catch (error) {
    console.error('Erreur lors du téléchargement des images du jeu:', error);
    return { data: null, error };
  }
};
