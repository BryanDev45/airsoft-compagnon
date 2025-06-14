
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Users, UserIcon, Shield } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import NotificationSheet from './NotificationSheet';

interface DesktopAuthSectionProps {
  user: any;
  logout: () => Promise<void>;
  notifications: any[];
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
}

export const DesktopAuthSection: React.FC<DesktopAuthSectionProps> = ({
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

  const handleNavigateToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="flex items-center gap-4">
      <NotificationSheet
        notifications={notifications}
        notificationCount={notificationCount}
        handleSheetOpenChange={handleSheetOpenChange}
      />

      {user?.Admin && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNavigateToAdmin}
          className="flex items-center gap-2 border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
        >
          <Shield className="h-4 w-4" />
          Admin
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center gap-2">
            <span>{user.username}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <UserIcon className="mr-2 h-4 w-4" /> Mon profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleNavigateToTeam}>
            <Users className="mr-2 h-4 w-4" /> Mon équipe
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
