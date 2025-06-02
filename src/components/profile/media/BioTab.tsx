
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioTabProps {
  username: string;
  bio: string;
  onUsernameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

const BioTab: React.FC<BioTabProps> = ({
  username,
  bio,
  onUsernameChange,
  onBioChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Votre nom d'utilisateur"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Parlez de vous en quelques mots..."
          className="min-h-[120px]"
        />
        <p className="text-xs text-gray-500">
          Cette description sera visible sur votre profil public
        </p>
      </div>
    </div>
  );
};

export default BioTab;
