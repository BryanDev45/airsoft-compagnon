
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { GameData } from '@/types/game';

export const useGameEditImages = (gameData: GameData | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (gameData) {
      // Load existing images
      const images = [];
      if (gameData.Picture1) images.push(gameData.Picture1);
      if (gameData.Picture2) images.push(gameData.Picture2);
      if (gameData.Picture3) images.push(gameData.Picture3);
      if (gameData.Picture4) images.push(gameData.Picture4);
      if (gameData.Picture5) images.push(gameData.Picture5);
      
      console.log("Images existantes chargées:", images);
      setExistingImages(images);
      setPreview(images);
    }
  }, [gameData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalImagesCount = images.length + newFiles.length + existingImages.length;
      
      if (totalImagesCount > 5) {
        toast({
          title: "Limite atteinte",
          description: "Vous ne pouvez pas ajouter plus de 5 images au total",
          variant: "destructive"
        });
        return;
      }
      
      const updatedImages = [...images, ...newFiles];
      setImages(updatedImages);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreview([...existingImages, ...preview.slice(existingImages.length), ...newPreviews]);
      
      console.log(`${newFiles.length} nouvelles images ajoutées, total maintenant: ${updatedImages.length} + ${existingImages.length} existantes`);
    }
  };

  const removeImage = (index: number) => {
    const newPreview = [...preview];
    
    if (index < existingImages.length) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
      
      newPreview.splice(index, 1);
      setPreview(newPreview);
      
      console.log(`Image existante supprimée à l'index ${index}, restantes: ${newExistingImages.length}`);
    } else {
      const adjustedIndex = index - existingImages.length;
      
      const newImages = [...images];
      newImages.splice(adjustedIndex, 1);
      setImages(newImages);
      
      newPreview.splice(index, 1);
      setPreview(newPreview);
      
      console.log(`Nouvelle image supprimée à l'index ajusté ${adjustedIndex}, restantes: ${newImages.length}`);
    }
  };

  return {
    images,
    preview,
    existingImages,
    handleImageChange,
    removeImage
  };
};
