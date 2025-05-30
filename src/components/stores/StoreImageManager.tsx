
import React, { useState, useEffect } from 'react';
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { MapStore } from '@/hooks/useMapData';

interface StoreImageManagerProps {
  editStore?: MapStore;
  onImagesChange: (images: File[], previews: string[]) => void;
  maxImages?: number;
}

export default function StoreImageManager({
  editStore,
  onImagesChange,
  maxImages = 5
}: StoreImageManagerProps) {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // Initialize with existing images when editing
  useEffect(() => {
    if (editStore) {
      const existingImages = [
        editStore.image,
        editStore.picture2,
        editStore.picture3,
        editStore.picture4,
        editStore.picture5
      ].filter(Boolean) as string[];
      
      setPreview(existingImages);
      setImages([]); // Reset file inputs for existing images
    } else {
      setImages([]);
      setPreview([]);
    }
  }, [editStore]);

  // Notify parent component of changes
  useEffect(() => {
    onImagesChange(images, preview);
  }, [images, preview, onImagesChange]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImageCount = preview.length;
    const availableSlots = maxImages - currentImageCount;
    const newFiles = files.slice(0, availableSlots);

    if (newFiles.length > 0) {
      const newImages = [...images, ...newFiles];
      setImages(newImages);

      // Create preview URLs for new files
      const newPreviews = [...preview];
      newFiles.forEach(file => {
        newPreviews.push(URL.createObjectURL(file));
      });
      setPreview(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = preview.filter((_, i) => i !== index);
    setPreview(newPreviews);

    // If it's a newly added file (not from database), remove from files array
    const newImages = images.filter((_, i) => {
      const existingImageCount = editStore ? [
        editStore.image,
        editStore.picture2,
        editStore.picture3,
        editStore.picture4,
        editStore.picture5
      ].filter(Boolean).length : 0;
      
      return i !== (index - existingImageCount);
    });
    setImages(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-medium flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" /> Photos du magasin
        </FormLabel>
        <span className="text-xs text-neutral-500 font-medium">
          {preview.length}/{maxImages} images
        </span>
      </div>

      {preview.length < maxImages && (
        <label htmlFor="image-upload" className="cursor-pointer block">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-neutral-50 transition-colors">
            <Upload className="h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-600 font-medium">Ajouter des photos</p>
            <p className="mt-1 text-xs text-neutral-500">Formats acceptés: JPG, PNG, GIF</p>
          </div>
          <Input 
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={preview.length >= maxImages}
          />
        </label>
      )}
      
      {/* Prévisualisations des images */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {preview.map((src, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden h-24 border border-neutral-200 shadow-sm">
              <img src={src} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="bg-red-500 text-white rounded-full p-1.5 flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Supprimer l'image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
