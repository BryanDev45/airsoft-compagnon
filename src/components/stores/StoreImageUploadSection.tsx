
import React from 'react';
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image, X } from 'lucide-react';

interface StoreImageUploadProps {
  images: File[];
  preview: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  maxImages?: number;
}

export default function StoreImageUploadSection({
  images,
  preview,
  handleImageChange,
  removeImage,
  maxImages = 5
}: StoreImageUploadProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Photos du magasin (max {maxImages})</FormLabel>
      <div className="flex items-center gap-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <Image className="h-6 w-6 text-gray-400" />
            <p className="mt-1 text-sm text-gray-500">Ajouter des photos</p>
            <p className="text-xs text-gray-400">{images.length}/{maxImages} images</p>
          </div>
          <Input 
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={images.length >= maxImages}
          />
        </label>
      </div>
      
      {/* Prévisualisations des images */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {preview.map((src, index) => (
            <div key={index} className="relative rounded-md overflow-hidden h-20 border border-gray-200">
              <img src={src} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
              <button 
                type="button" 
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                aria-label="Supprimer l'image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
