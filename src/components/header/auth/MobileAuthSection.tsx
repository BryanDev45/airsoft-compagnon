
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Users, UserIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import NotificationSheet from './NotificationSheet';

interface MobileAuthSectionProps {
  user: any;
  logout: () => Promise<void>;
  notifications: any[];
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
}

export const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({
  user,
  logout,
  notifications,
  notificationCount,
  handleSheetOpenChange
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigateToTeam = () => {
    if (user?.team_id) {
      console.log("Navigating to team with ID:", user.team_id);
      navigate(`/team/${user.team_id}`);
    } else {
      console.log("No team found for user:", user);
      toast({
        title: "Information",
        description: "Vous n'êtes pas membre d'une équipe"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Notifications */}
      <div className="text-white">
        <NotificationSheet
          notifications={notifications}
          notificationCount={notificationCount}
          handleSheetOpenChange={handleSheetOpenChange}
          isMobile={true}
        />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 py-2 px-2 bg-gray-800 rounded-md">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="text-sm">{user?.username?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <span className="text-white text-sm font-medium">{user.username}</span>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-white hover:text-airsoft-red hover:bg-gray-800"
          onClick={() => navigate('/profile')}
        >
          <UserIcon size={16} className="mr-2" /> Mon profil
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-white hover:text-airsoft-red hover:bg-gray-800"
          onClick={handleNavigateToTeam}
        >
          <Users size={16} className="mr-2" /> Mon équipe
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full bg-airsoft-red hover:bg-red-700 mt-3"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </div>
  );
};
