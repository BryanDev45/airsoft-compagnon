
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4 pb-4">
      <div className="text-sm font-medium mb-3">Avatars par défaut</div>
      <div className="grid grid-cols-3 gap-4 min-h-[300px]">
        {defaultAvatars.map((avatarUrl, index) => (
          <Button
            key={index}
            variant="outline"
            className={`p-3 h-auto transition-all duration-200 hover:scale-105 ${
              selectedAvatar === avatarUrl 
                ? 'ring-2 ring-airsoft-red shadow-md' 
                : 'hover:shadow-sm'
            }`}
            onClick={() => onSelectAvatar(avatarUrl)}
          >
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
              <AvatarFallback className="text-lg">A{index + 1}</AvatarFallback>
            </Avatar>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DefaultAvatarSelector;
