
import { supabase } from "@/integrations/supabase/client";
import { createAirsoftGame, uploadGameImages } from "@/utils/supabaseHelpers";

export const handleImageUpload = async (gameId: string, images: File[]): Promise<{ success: boolean, imageUrls?: string[], error?: any, errorMessage?: string }> => {
  if (images.length === 0) {
    console.log("Aucune image à télécharger");
    return { success: true, imageUrls: [] };
  }
  
  try {
    console.log(`Téléchargement de ${images.length} images pour la partie ${gameId}`);
    const { data: imageUrls, error: uploadError } = await uploadGameImages(gameId, images);
    
    if (uploadError) {
      console.error("Erreur lors du téléchargement des images:", uploadError);
      return { 
        success: false, 
        error: uploadError,
        errorMessage: "Certaines images n'ont pas pu être téléchargées" 
      };
    }
    
    if (!imageUrls || imageUrls.length === 0) {
      console.warn("Aucune URL d'image n'a été retournée après le téléchargement");
      return { success: true, imageUrls: [] };
    }
    
    console.log("URLs des images téléchargées avec succès");
    return { success: true, imageUrls };
    
  } catch (error) {
    console.error("Erreur inattendue lors du téléchargement des images:", error);
    return { 
      success: false, 
      error, 
      errorMessage: "Une erreur inattendue est survenue lors du téléchargement des images" 
    };
  }
};

export const createGame = async (gameData: any): Promise<{ success: boolean, gameId?: string, error?: any }> => {
  try {
    const { data: gameResult, error } = await createAirsoftGame(gameData);
    
    if (error || !gameResult) {
      throw new Error(error?.message || "Erreur lors de la création de la partie");
    }
    
    console.log("Partie créée avec succès, ID:", gameResult.id);
    return { success: true, gameId: gameResult.id };
  } catch (error) {
    console.error("Erreur lors de la création de la partie:", error);
    return { success: false, error };
  }
};

export const registerOrganizer = async (gameId: string, userId: string): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error: participationError } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameId,
        user_id: userId,
        role: 'Organisateur',
        status: 'Confirmé'
      });
      
    if (participationError) {
      console.error("Erreur lors de l'inscription de l'organisateur:", participationError);
      return { success: false, error: participationError };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'organisateur:", error);
    return { success: false, error };
  }
};
