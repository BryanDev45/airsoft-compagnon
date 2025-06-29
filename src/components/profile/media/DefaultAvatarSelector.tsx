
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DefaultAvatarSelectorProps {
  onSelectAvatar: (avatarUrl: string) => void;
  selectedAvatar?: string | null;
}

const DefaultAvatarSelector: React.FC<DefaultAvatarSelectorProps> = ({ 
  onSelectAvatar, 
  selectedAvatar 
}) => {
  const defaultAvatars = [
    "/lovable-uploads/dc20bd05-193b-4100-bf42-cfbbb20433ad.png",
    "/lovable-uploads/dbca34c0-4c90-48de-b573-3ee4118da4d1.png",
    "/lovable-uploads/b4ffe288-3017-4672-a679-cb442d6f00e0.png",
    "/lovable-uploads/79637843-91ff-413e-80fc-ac24713183c3.png",
    "/lovable-uploads/52a37106-d8af-4a71-9d67-4d69bd884c8f.png",
    "/lovable-uploads/49b5c95b-338d-461a-a797-2eef2ab61a57.png",
    "/lovable-uploads/ca9d4753-24b0-4adb-9da7-794e0fbcfaf1.png",
    "/lovable-uploads/63ae8036-d898-401e-a762-336100a83548.png",
    "/lovable-uploads/a4df09ac-5a49-4869-8fef-3e20a189c7cd.png"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Avatars par défaut</h3>
        <p className="text-sm text-gray-500">Choisissez un avatar parmi notre sélection</p>
      </div>
      
      <ScrollArea className="h-96 w-full">
        <div className="grid grid-cols-3 gap-4 p-2">
          {defaultAvatars.map((avatarUrl, index) => {
            const isSelected = selectedAvatar === avatarUrl;
            
            return (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => onSelectAvatar(avatarUrl)}
              >
                <div className={`
                  relative p-3 rounded-xl border-2 transition-all duration-300 ease-out
                  ${isSelected 
                    ? 'border-airsoft-red bg-red-50 shadow-lg ring-4 ring-red-100' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
                  }
                  group-hover:scale-105 transform
                `}>
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage 
                      src={avatarUrl} 
                      alt={`Avatar ${index + 1}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      A{index + 1}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Overlay sélection */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-airsoft-red/10 rounded-xl flex items-center justify-center">
                      <div className="bg-airsoft-red text-white rounded-full p-1">
                        <Check size={16} />
                      </div>
                    </div>
                  )}
                  
                  {/* Effet hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                
                {/* Label numéroté */}
                <div className="text-center mt-2">
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-airsoft-red' : 'text-gray-400'
                  }`}>
                    Avatar {index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      {selectedAvatar && (
        <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            ✓ Avatar sélectionné avec succès
          </p>
        </div>
      )}
    </div>
  );
};

export default DefaultAvatarSelector;
