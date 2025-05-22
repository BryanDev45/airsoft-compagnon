
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, RefreshCw, ImageIcon } from 'lucide-react';

interface BannerUploaderProps {
  bannerPreview: string | null;
  onBannerChange: (bannerUrl: string | null) => void;
}

const BannerUploader: React.FC<BannerUploaderProps> = ({ 
  bannerPreview, 
  onBannerChange 
}) => {
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille de l'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onBannerChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full">
        <div className="h-32 w-full rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-airsoft-red flex items-center justify-center">
          {bannerPreview ? (
            <img 
              src={bannerPreview} 
              alt="Banner preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-10 w-10 text-white" />
          )}
        </div>
      </div>
      <div className="flex gap-3 mb-2">
        <Label 
          htmlFor="banner-upload" 
          className="flex items-center gap-1 bg-airsoft-red hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm"
        >
          <Upload size={16} />
          Télécharger
        </Label>
        <input 
          id="banner-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleBannerChange} 
          className="hidden" 
        />
        {bannerPreview && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBannerChange(null)}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Réinitialiser
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 text-center">
        Format recommandé : 1500x500px. Taille maximale : 5MB.
      </p>
    </div>
  );
};

export default BannerUploader;
