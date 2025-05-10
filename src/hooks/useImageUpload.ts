
import { useState } from 'react';

export const useImageUpload = (maxImages: number = 5) => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Check if adding these files would exceed the maximum
      if (images.length + filesArray.length > maxImages) {
        // Only add files up to the maximum limit
        const remainingSlots = Math.max(0, maxImages - images.length);
        const newImages = [...images, ...filesArray.slice(0, remainingSlots)];
        setImages(newImages);
        
        // Generate previews for the new images
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        
        // Revoke old previews to avoid memory leaks
        preview.forEach(url => URL.revokeObjectURL(url));
        
        setPreview(newPreviews);
      } else {
        // We can add all the files
        const newImages = [...images, ...filesArray];
        setImages(newImages);
        
        // Generate previews for the new images
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        
        // Revoke old previews to avoid memory leaks
        preview.forEach(url => URL.revokeObjectURL(url));
        
        setPreview(newPreviews);
      }
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...preview];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreview(newPreviews);
  };
  
  return {
    images,
    preview,
    handleImageChange,
    removeImage,
    setImages,
    setPreview
  };
};
