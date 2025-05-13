
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useImageUpload = (maxImages: number = 5) => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Verify that the added images don't exceed the limit
      if (images.length + filesArray.length > maxImages) {
        // Take only the number of images that will reach the limit
        const remainingSlots = Math.max(0, maxImages - images.length);
        const newFiles = filesArray.slice(0, remainingSlots);
        
        if (newFiles.length === 0) {
          toast({
            title: "Limite atteinte",
            description: `Vous ne pouvez pas ajouter plus de ${maxImages} images`,
            variant: "destructive"
          });
          return;
        }
        
        const newImages = [...images, ...newFiles];
        setImages(newImages);
        
        // Revoke old URLs to avoid memory leaks
        preview.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        
        // Generate new previews
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        setPreview(newPreviews);
        
        if (remainingSlots < filesArray.length) {
          toast({
            title: "Limite d'images atteinte",
            description: `Seules ${remainingSlots} image(s) ont été ajoutées pour atteindre la limite de ${maxImages} images`,
            variant: "default"
          });
        }
      } else {
        // Add all new images
        const newImages = [...images, ...filesArray];
        setImages(newImages);
        
        // Revoke old URLs to avoid memory leaks
        preview.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        
        // Generate new previews
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        setPreview(newPreviews);
        
        toast({
          title: "Images ajoutées",
          description: `${filesArray.length} image(s) ajoutée(s)`,
          variant: "default"
        });
      }
    }
  };
  
  const removeImage = (index: number) => {
    if (index < 0 || index >= images.length) {
      console.error('Index de suppression d\'image invalide');
      return;
    }
    
    // Revoke the URL of the image to remove if it's a blob URL
    if (preview[index] && preview[index].startsWith('blob:')) {
      URL.revokeObjectURL(preview[index]);
    }
    
    // Remove the image and its preview
    const newImages = [...images];
    newImages.splice(index, 1);
    
    const newPreviews = [...preview];
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreview(newPreviews);
    
    toast({
      title: "Image supprimée",
      description: `Image supprimée, ${newImages.length}/${maxImages} images restantes`,
      variant: "default"
    });
  };
  
  const clearImages = () => {
    // Clean all blob previews to avoid memory leaks
    preview.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setImages([]);
    setPreview([]);
    toast({
      title: "Images réinitialisées",
      description: "Toutes les images ont été supprimées",
      variant: "default"
    });
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
