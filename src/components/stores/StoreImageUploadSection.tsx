
import React from 'react';
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, X, Upload } from 'lucide-react';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-medium flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" /> Photos du magasin
        </FormLabel>
        <span className="text-xs text-neutral-500 font-medium">
          {images.length}/{maxImages} images
        </span>
      </div>

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
          disabled={images.length >= maxImages}
        />
      </label>
      
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
