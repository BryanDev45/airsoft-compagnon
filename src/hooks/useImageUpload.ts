
import { useState } from 'react';

export const useImageUpload = (maxImages: number = 5) => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...images, ...filesArray].slice(0, maxImages);
      setImages(newImages);
      
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreview(newPreviews);
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
    setImages
  };
};
