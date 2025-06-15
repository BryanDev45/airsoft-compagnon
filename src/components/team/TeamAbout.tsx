
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, Share2, Mail, Trophy, Star } from 'lucide-react';
import TeamApplicationButton from './TeamApplicationButton';

interface TeamAboutProps {
  team: any;
  handleContactTeam: () => void;
  handleShare: () => void;
  isTeamMember: boolean;
  currentUserId?: string;
  onTeamUpdate?: () => void;
}

const TeamAbout: React.FC<TeamAboutProps> = ({ 
  team, 
  handleContactTeam, 
  handleShare, 
  isTeamMember,
  currentUserId,
  onTeamUpdate
}) => {
  return (
    <div className="space-y-6">
      {/* Section principale À propos */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-airsoft-red/10 rounded-lg">
              <Users className="h-5 w-5 text-airsoft-red" />
            </div>
            À propos de l'équipe
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-sm">
              {team.description || "Aucune description disponible."}
            </p>
          </div>
          
          {/* Informations de l'équipe dans une grille */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {team.location && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Localisation</span>
                  <p className="text-gray-900 font-medium">{team.location}</p>
                </div>
              </div>
            )}
            
            {team.founded && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fondée en</span>
                  <p className="text-gray-900 font-medium">{team.founded}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Membres</span>
                <p className="text-gray-900 font-medium">{team.stats?.memberCount || 0} membres</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Note moyenne</span>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-medium">{team.stats?.averageRating || '0.0'}/5</p>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Badges d'informations */}
          <div className="flex flex-wrap gap-2">
            {team.is_association && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                Association déclarée
              </Badge>
            )}
            {team.is_recruiting && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Recrute activement
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isTeamMember && (
            <>
              <TeamApplicationButton
                teamId={team.id}
                teamName={team.name}
                leaderId={team.leader_id}
                isRecruiting={team.is_recruiting}
                currentUserId={currentUserId}
                onApplicationSent={onTeamUpdate}
              />
              <Button 
                className="w-full bg-airsoft-red hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={handleContactTeam}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacter l'équipe
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            className="w-full border-gray-200 hover:bg-gray-50 transition-all duration-200"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager cette équipe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAbout;
