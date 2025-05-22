
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, RefreshCw, ImageIcon } from 'lucide-react';

interface AvatarUploaderProps {
  avatarPreview: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ 
  avatarPreview, 
  onAvatarChange 
}) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille de l'image ne doit pas dépasser 2MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
          <AvatarFallback>
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex gap-3 mb-2">
        <Label 
          htmlFor="avatar-upload" 
          className="flex items-center gap-1 bg-airsoft-red hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm"
        >
          <Upload size={16} />
          Télécharger
        </Label>
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleAvatarChange} 
          className="hidden" 
        />
        
        {avatarPreview && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAvatarChange(null)}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Réinitialiser
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 text-center">
        Formats acceptés : JPG, PNG. Taille maximale : 2MB.
      </p>
    </div>
  );
};

export default AvatarUploader;
