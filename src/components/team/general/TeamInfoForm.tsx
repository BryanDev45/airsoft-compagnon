
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamData } from '@/types/team';

interface TeamInfoFormProps {
  name: string;
  setName: (name: string) => void;
  location: string;
  setLocation: (location: string) => void;
  founded: string;
  setFounded: (founded: string) => void;
  loading: boolean;
  handleUpdateTeamInfo: () => Promise<void>;
}

const TeamInfoForm = ({
  name,
  setName,
  location,
  setLocation,
  founded,
  setFounded,
  loading,
  handleUpdateTeamInfo
}: TeamInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom de l'équipe</label>
        <Input 
          value={name} 
          onChange={e => setName(e.target.value)}
          placeholder="Nom de l'équipe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Localisation</label>
        <Input 
          value={location} 
          onChange={e => setLocation(e.target.value)}
          placeholder="Localisation"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Date de fondation</label>
        <Input 
          value={founded} 
          onChange={e => setFounded(e.target.value)}
          placeholder="Année de fondation"
          type="number"
          min="1990"
          max="2099"
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleUpdateTeamInfo}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default TeamInfoForm;
