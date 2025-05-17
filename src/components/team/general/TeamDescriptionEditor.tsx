
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenBox, X, Save } from "lucide-react";

interface TeamDescriptionEditorProps {
  description: string;
  setDescription: (description: string) => void;
  isEditingBio: boolean;
  setIsEditingBio: (isEditing: boolean) => void;
  loading: boolean;
  handleUpdateDescription: () => Promise<void>;
  originalDescription: string | undefined;
}

const TeamDescriptionEditor = ({
  description,
  setDescription,
  isEditingBio,
  setIsEditingBio,
  loading,
  handleUpdateDescription,
  originalDescription
}: TeamDescriptionEditorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Description de l'équipe</label>
      {isEditingBio ? (
        <div className="space-y-2">
          <Textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Description de l'équipe"
            className="h-32"
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDescription(originalDescription || '');
                setIsEditingBio(false);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            
            <Button 
              size="sm"
              onClick={handleUpdateDescription}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-1" />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-md p-3 bg-gray-50 min-h-[100px]">
            {description || <span className="text-gray-400 italic">Aucune description</span>}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-gray-600 hover:text-gray-900"
            onClick={() => setIsEditingBio(true)}
          >
            <PenBox className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamDescriptionEditor;
