
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageIcon } from 'lucide-react';
import { ImageUploadSectionProps } from '@/types/party';

const ImageUploadSection = ({ 
  images, 
  preview, 
  handleImageChange, 
  removeImage,
  updateFormData,
  initialData 
}: ImageUploadSectionProps) => {
  
  // Si updateFormData est fourni, on peut l'utiliser pour mettre à jour les données du formulaire
  React.useEffect(() => {
    if (updateFormData) {
      console.log("Mise à jour des images dans le formulaire:", images);
      updateFormData('images', { images });
    }
  }, [images, updateFormData]);
  
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
            disabled={preview.length >= 5}
          />
          <label 
            htmlFor="images" 
            className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-airsoft-red transition-colors ${preview.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ImageIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500">
              {preview.length >= 5 
                ? "Limite de 5 images atteinte" 
                : "Cliquez pour sélectionner des images"}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Les images seront affichées sur la page de la partie.
          </p>
        </div>
        
        {preview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {preview.map((src, index) => (
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
