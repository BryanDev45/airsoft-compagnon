
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
    
    console.log(`Début de l'upload de ${images.length} images pour le jeu ${gameId}`);
    
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
    
    if (imageUrls.length > 0) {
      // Récupération des URLs d'images existantes pour ce jeu
      const { data: gameData, error: fetchError } = await supabase
        .from('airsoft_games')
        .select('Picture1, Picture2, Picture3, Picture4, Picture5')
        .eq('id', gameId)
        .single();
      
      if (fetchError) {
        console.error("Erreur lors de la récupération des données du jeu:", fetchError);
      }
      
      // Collecter toutes les URLs d'images existantes qui ne sont pas null
      const existingImages: string[] = [];
      if (gameData) {
        if (gameData.Picture1) existingImages.push(gameData.Picture1);
        if (gameData.Picture2) existingImages.push(gameData.Picture2);
        if (gameData.Picture3) existingImages.push(gameData.Picture3);
        if (gameData.Picture4) existingImages.push(gameData.Picture4);
        if (gameData.Picture5) existingImages.push(gameData.Picture5);
      }
      
      console.log("Images existantes:", existingImages);
      
      // Combiner les images existantes avec les nouvelles (max 5)
      const allImages = [...existingImages, ...imageUrls].slice(0, 5);
      console.log("Images combinées (max 5):", allImages);
      
      // Mettre à jour les champs Picture1-Picture5 dans la base de données
      const updateData: Record<string, string> = {};
      
      // Réinitialiser tous les champs d'image à null d'abord
      for (let i = 1; i <= 5; i++) {
        updateData[`Picture${i}`] = null;
      }
      
      // Assigner chaque URL d'image à son champ correspondant
      allImages.forEach((url, idx) => {
        const fieldName = `Picture${idx + 1}`;
        updateData[fieldName] = url;
      });
      
      // Mise à jour des URL des images dans la base de données
      console.log("Mise à jour des URL d'images pour le jeu:", gameId, updateData);
      const { error: updateError } = await supabase
        .from('airsoft_games')
        .update(updateData)
        .eq('id', gameId);
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour des URL d'images:", updateError);
        return { data: imageUrls, error: updateError };
      }
      
      console.log("Les URLs des images ont été mises à jour avec succès dans la base de données");
      return { data: allImages, error: null };
    }
    
    return { data: imageUrls, error: null };
  } catch (error) {
    console.error('Erreur lors du téléchargement des images du jeu:', error);
    return { data: null, error };
  }
};
