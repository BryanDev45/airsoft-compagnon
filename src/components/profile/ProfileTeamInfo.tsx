import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, Award, Building2, Search } from 'lucide-react';
interface ProfileTeamInfoProps {
  profileData: any;
  isOwnProfile: boolean;
}
const ProfileTeamInfo: React.FC<ProfileTeamInfoProps> = ({
  profileData,
  isOwnProfile
}) => {
  const navigate = useNavigate();
  return <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Équipe</h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-500 block mb-1 text-left">Équipe</span>
            {profileData?.team ? <div className="flex items-center justify-between">
                {profileData?.team_id ? <Link to={`/team/${profileData.team_id}`} className="font-medium transition-colors duration-200">
                    {profileData.team}
                  </Link> : <p className="font-medium">{profileData.team}</p>}
              </div> : <div className="flex items-center justify-between">
                <p className="font-medium">Aucune équipe</p>
                {isOwnProfile && <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => navigate('/parties?tab=teams')}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>}
              </div>}
          </div>
        </div>
        
        {profileData?.is_team_leader && <div className="flex items-start space-x-3">
            <Award className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-500 block mb-1 text-left">Statut d'équipe</span>
              <p className="font-medium text-left">Chef d'équipe</p>
            </div>
          </div>}
        
        {profileData?.association && <div className="flex items-start space-x-3">
            <Building2 className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-500 block mb-1">Association</span>
              <p className="font-medium">{profileData.association}</p>
            </div>
          </div>}
      </div>
    </div>;
};
export default ProfileTeamInfo;