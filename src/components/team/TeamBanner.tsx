import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import TeamSettings from './TeamSettings';
interface TeamBannerProps {
  team: any;
  isTeamMember?: boolean;
  onTeamUpdate?: (updatedTeam: any) => void;
}
const TeamBanner = ({
  team,
  isTeamMember = false,
  onTeamUpdate
}: TeamBannerProps) => {
  return <div className="h-64 bg-cover bg-center relative" style={{
    backgroundImage: `url(${team.banner})`
  }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
        <Link to="/" className="text-white hover:text-gray-200 transition-colors absolute top-6 left-6">
          <ArrowLeft className="mr-2" />
          <span className="sr-only">Retour</span>
        </Link>
        
        {/* Team Settings Button - Only visible to team members now */}
        <TeamSettings team={team} isTeamMember={isTeamMember} onTeamUpdate={onTeamUpdate} />
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={team.logo} alt={team.name} className="w-24 h-24 rounded-full border-3 border-red object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{team.name}</h1>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-200">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {team.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Fondée en {team.founded}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {team.members.length} membres
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default TeamBanner;