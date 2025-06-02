
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useLastGameImages = () => {
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const fetchLastGameImages = async (gameId: string): Promise<string[]> => {
    setIsLoadingImages(true);
    try {
      const { data: game, error } = await supabase
        .from('airsoft_games')
        .select('Picture1, Picture2, Picture3, Picture4, Picture5')
        .eq('id', gameId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des images:', error);
        return [];
      }

      const imageUrls = [
        game.Picture1,
        game.Picture2,
        game.Picture3,
        game.Picture4,
        game.Picture5
      ].filter(Boolean);

      return imageUrls;
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
      return [];
    } finally {
      setIsLoadingImages(false);
    }
  };

  const convertUrlsToFiles = async (imageUrls: string[]): Promise<File[]> => {
    const files: File[] = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const response = await fetch(imageUrls[i]);
        const blob = await response.blob();
        const file = new File([blob], `image_${i + 1}.jpg`, { type: blob.type });
        files.push(file);
      } catch (error) {
        console.error(`Erreur lors de la conversion de l'image ${i + 1}:`, error);
      }
    }
    
    return files;
  };

  return {
    isLoadingImages,
    fetchLastGameImages,
    convertUrlsToFiles
  };
};
