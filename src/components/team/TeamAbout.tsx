
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Mail, Share2, Activity } from "lucide-react";

interface TeamAboutProps {
  team: {
    name: string;
    description?: string;
    location?: string;
    founded?: number; // Updated from string to number
    contactEmail?: string;
    is_recruiting?: boolean;
    is_association?: boolean;
    stats: {
      memberCount: number;
      gamesPlayed: number;
      averageRating: string;
    };
  };
  handleContactTeam: () => void;
  handleShare: () => void;
}

const TeamAbout = ({ team, handleContactTeam, handleShare }: TeamAboutProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>À propos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          {team.description || "Cette équipe n'a pas encore ajouté de description."}
        </p>
        
        <div className="space-y-2">
          {team.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{team.location}</span>
            </div>
          )}
          
          {team.founded && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Fondée en {team.founded}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>{team.stats.memberCount} membres</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Activity className="h-4 w-4 mr-2 text-gray-500" />
            <span>{team.stats.gamesPlayed} parties organisées</span>
          </div>
          
          {team.is_association && (
            <div className="mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Association déclarée</span>
            </div>
          )}
          
          {team.is_recruiting && (
            <div className="mt-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Recrutement ouvert</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleContactTeam}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAbout;
