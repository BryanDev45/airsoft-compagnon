
import { useState } from 'react';

export const useImageUpload = (maxImages: number = 5) => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Vérifier que l'ajout des nouvelles images ne dépasse pas la limite
      if (images.length + filesArray.length > maxImages) {
        // Prendre seulement le nombre d'images qui permettra d'atteindre la limite
        const remainingSlots = Math.max(0, maxImages - images.length);
        const newFiles = filesArray.slice(0, remainingSlots);
        
        if (newFiles.length === 0) {
          console.warn(`Limite maximum de ${maxImages} images déjà atteinte`);
          return;
        }
        
        const newImages = [...images, ...newFiles];
        setImages(newImages);
        
        // Révoquer les anciens URLs pour éviter les fuites mémoire
        preview.forEach(url => URL.revokeObjectURL(url));
        
        // Générer de nouvelles previews
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        setPreview(newPreviews);
        
        console.log(`Limite maximum de ${maxImages} images atteinte après ajout de ${newFiles.length} images`);
      } else {
        // Ajouter toutes les nouvelles images
        const newImages = [...images, ...filesArray];
        setImages(newImages);
        
        // Révoquer les anciens URLs pour éviter les fuites mémoire
        preview.forEach(url => URL.revokeObjectURL(url));
        
        // Générer de nouvelles previews
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        setPreview(newPreviews);
        
        console.log(`${filesArray.length} images ajoutées, total: ${newImages.length}/${maxImages}`);
      }
    }
  };
  
  const removeImage = (index: number) => {
    if (index < 0 || index >= images.length) {
      console.error('Index de suppression d\'image invalide');
      return;
    }
    
    // Révoquer l'URL de l'image à supprimer
    if (preview[index]) {
      URL.revokeObjectURL(preview[index]);
    }
    
    // Supprimer l'image et sa preview
    const newImages = [...images];
    newImages.splice(index, 1);
    
    const newPreviews = [...preview];
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreview(newPreviews);
    
    console.log(`Image à l'index ${index} supprimée, ${newImages.length} images restantes`);
  };
  
  const clearImages = () => {
    // Nettoyer toutes les previews pour éviter les fuites mémoire
    preview.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreview([]);
    console.log('Toutes les images ont été supprimées');
  };
  
  return {
    images,
    preview,
    handleImageChange,
    removeImage,
    clearImages,
    setImages,
    setPreview
  };
};
