
import React from 'react';
import { Edit, Save, Settings, LogOut, Calendar, Trophy, Clock, Shield, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  user: any;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleLogout: () => void;
  handleViewAllBadges: () => void;
}

const ProfileHeader = ({ user, editing, setEditing, handleLogout, handleViewAllBadges }: ProfileHeaderProps) => {
  return (
    <div className="bg-airsoft-dark text-white p-6 relative">
      <div className="absolute right-6 top-6 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
          onClick={() => setEditing(!editing)}
        >
          {editing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {editing ? "Sauvegarder" : "Modifier"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
        >
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          {editing && (
            <Button 
              size="sm" 
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-airsoft-red hover:bg-red-700"
            >
              <Edit size={14} />
            </Button>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {user.username}
            {user.isVerified && (
              <img 
                src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png"
                alt="Vérifié"
                className="w-6 h-6 ml-1"
                title="Profil vérifié"
              />
            )}
          </h1>
          <div className="flex items-center gap-1 text-sm text-gray-200">
            <Calendar size={14} />
            <span>Membre depuis {user.joinDate}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-airsoft-red border-none">
              <Trophy size={14} className="mr-1" /> {user.stats.level}
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              <Clock size={14} className="mr-1" /> {user.stats.gamesPlayed} parties
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              <Shield size={14} className="mr-1" /> {user.stats.gamesOrganized} organisées
            </Badge>
            <Badge 
              variant="outline" 
              className="text-white border-white cursor-pointer hover:bg-white/10"
              onClick={handleViewAllBadges}
            >
              <Award size={14} className="mr-1" /> {user.badges.length} badges
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
