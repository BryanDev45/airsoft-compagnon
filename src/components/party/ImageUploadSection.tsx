
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageIcon } from 'lucide-react';
import { ImageUploadSectionProps } from "@/types/party";

const ImageUploadSection = ({ 
  updateFormData, 
  initialData, 
  images: externalImages, 
  preview: externalPreview,
  handleImageChange: externalHandleImageChange,
  removeImage: externalRemoveImage
}: ImageUploadSectionProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // Load initial images if available
  useEffect(() => {
    if (initialData && initialData.images) {
      // If initialData contains image URLs, show those
      setPreview(Array.isArray(initialData.images) ? initialData.images : []);
    }
  }, [initialData]);

  // Use external image handlers if provided
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (externalHandleImageChange) {
      externalHandleImageChange(e);
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Check if adding these files would exceed the maximum (5)
      if (images.length + filesArray.length > 5) {
        // Only add files up to the maximum limit
        const remainingSlots = Math.max(0, 5 - images.length);
        const newImages = [...images, ...filesArray.slice(0, remainingSlots)];
        setImages(newImages);
        
        // Generate previews for the new images
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        
        // Revoke old previews to avoid memory leaks
        preview.forEach(url => {
          if (!url.startsWith('http')) {
            URL.revokeObjectURL(url);
          }
        });
        
        setPreview(newPreviews);
        
        // Notify parent component about image changes
        if (updateFormData) {
          updateFormData('images', { images: newImages });
        }
      } else {
        // We can add all the files
        const newImages = [...images, ...filesArray];
        setImages(newImages);
        
        // Generate previews for the new images
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        
        // Revoke old previews to avoid memory leaks
        preview.forEach(url => {
          if (!url.startsWith('http')) {
            URL.revokeObjectURL(url);
          }
        });
        
        setPreview(newPreviews);
        
        // Notify parent component about image changes
        if (updateFormData) {
          updateFormData('images', { images: newImages });
        }
      }
    }
  };
  
  const removeImage = (index: number) => {
    if (externalRemoveImage) {
      externalRemoveImage(index);
      return;
    }

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...preview];
    
    // Only revoke URL if it's an object URL, not a server URL
    if (!newPreviews[index].startsWith('http')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newPreviews.splice(index, 1);
    setPreview(newPreviews);
    
    // Notify parent component about image changes
    if (updateFormData) {
      updateFormData('images', { images: newImages });
    }
  };
  
  // Determine whether to use external state or internal state
  const displayImages = externalImages || images;
  const displayPreviews = externalPreview || preview;
  const displayMaxImages = 5;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-airsoft-red" />
          Images
        </CardTitle>
        <CardDescription>
          Ajoutez des photos du terrain (max. 5 images)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input 
            type="file" 
            id="images" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange} 
            className="hidden" 
            disabled={displayPreviews.length >= displayMaxImages}
          />
          <label 
            htmlFor="images" 
            className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-airsoft-red transition-colors ${displayPreviews.length >= displayMaxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ImageIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500">
              {displayPreviews.length >= displayMaxImages 
                ? "Limite de 5 images atteinte" 
                : "Cliquez pour sélectionner des images"}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Les images seront affichées sur la page de la partie.
          </p>
        </div>
        
        {displayPreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {displayPreviews.map((src, index) => (
              <div key={index} className="relative h-24 group">
                <img 
                  src={src} 
                  alt={`Preview ${index + 1}`} 
                  className="h-full w-full object-cover rounded-md" 
                />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)} 
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
