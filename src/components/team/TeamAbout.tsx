
import React from 'react';
import { MessageSquare, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamAboutProps {
  team: any;
  handleContactTeam: () => void;
  handleShare: () => void;
}

const TeamAbout = ({ team, handleContactTeam, handleShare }: TeamAboutProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>À propos de nous</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{team.description}</p>
        
        {team.organizationType && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                {team.organizationType === 'association' ? 'Association déclarée' : 'Équipe simple'}
              </Badge>
              <span className="text-blue-800">
                {team.organizationType === 'association' 
                  ? 'Organisation officielle avec statuts déposés' 
                  : 'Groupe informel de joueurs'}
              </span>
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Parties</p>
            <p className="text-xl font-bold text-airsoft-red">{team.stats.gamesPlayed}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Membres</p>
            <p className="text-xl font-bold text-airsoft-red">{team.stats.memberCount}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Évaluation</p>
            <p className="text-xl font-bold text-airsoft-red flex items-center justify-center">
              {team.stats.averageRating}
              <svg className="w-5 h-5 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleContactTeam}
          >
            <MessageSquare size={16} />
            Contacter
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-airsoft-red text-white hover:bg-red-700"
            onClick={handleShare}
          >
            <Share size={16} />
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAbout;
