
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
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&h=150&q=80", 
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Avatars par défaut</div>
      <div className="grid grid-cols-3 gap-3">
        {defaultAvatars.map((avatarUrl, index) => (
          <Button
            key={index}
            variant="outline"
            className={`p-2 h-auto ${selectedAvatar === avatarUrl ? 'ring-2 ring-airsoft-red' : ''}`}
            onClick={() => onSelectAvatar(avatarUrl)}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
              <AvatarFallback>A{index + 1}</AvatarFallback>
            </Avatar>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DefaultAvatarSelector;
