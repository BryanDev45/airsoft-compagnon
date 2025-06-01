
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, Share2, Mail, Trophy } from 'lucide-react';
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            À propos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            {team.description || "Aucune description disponible."}
          </p>
          
          <div className="space-y-3">
            {team.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{team.location}</span>
              </div>
            )}
            
            {team.founded && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Fondée en {team.founded}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{team.stats?.memberCount || 0} membres</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Trophy className="h-4 w-4" />
              <span>{team.stats?.averageRating || '0.0'}/5</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {team.is_association && (
              <Badge variant="secondary">Association</Badge>
            )}
            {team.is_recruiting && (
              <Badge className="bg-green-100 text-green-800">Recrute</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
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
                className="w-full bg-airsoft-red hover:bg-red-700"
                onClick={handleContactTeam}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacter l'équipe
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAbout;
