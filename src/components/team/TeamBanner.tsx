
import React from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
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
  return (
    <div className="h-64 bg-cover bg-center relative" style={{
      backgroundImage: `url(${team.banner})`
    }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-shrink-0">
              <img src={team.logo} alt={team.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/80 object-cover shadow-md" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl text-white font-bold">{team.name}</h1>
              <div className="flex items-center flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-sm text-gray-200">
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

          <div className="flex-shrink-0">
            <TeamSettings team={team} isTeamMember={isTeamMember} onTeamUpdate={onTeamUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBanner;
