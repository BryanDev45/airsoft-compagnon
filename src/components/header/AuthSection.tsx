
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { NotificationList } from '@/components/notifications/NotificationList';
import { LogOut, Bell, Users, UserIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/auth/useAuth';

interface AuthSectionProps {
  isDesktop?: boolean;
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  isDesktop = true,
  notificationCount,
  handleSheetOpenChange
}) => {
  const navigate = useNavigate();
  const { user, logout, initialLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = () => {
    navigate('/login');
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

  // If loading, show a basic login button to ensure users can always access login
  if (initialLoading) {
    return (
      <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
        Se connecter
      </Button>
    );
  }
  
  // If not authenticated, show login button
  if (!user) {
    return (
      <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
        Se connecter
      </Button>
    );
  }
  
  // If authenticated, show user menu and notifications
  if (isDesktop) {
    return (
      <div className="flex items-center gap-4">
        <Sheet onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} className={`${notificationCount > 0 ? 'text-airsoft-red' : 'text-white'} hover:text-airsoft-red transition-colors`} />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-airsoft-red">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-xl">Notifications</SheetTitle>
            </SheetHeader>
            <NotificationList />
            <SheetFooter className="mt-4">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">Fermer</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

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
  } else {
    // Mobile layout
    return (
      <div className="flex flex-col gap-4">
        <div className="py-2 text-white">
          <Sheet onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white">
                <Bell size={18} />
                <span>Notifications</span>
                {notificationCount > 0 && <Badge className="bg-airsoft-red">{notificationCount}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-xl">Notifications</SheetTitle>
              </SheetHeader>
              <NotificationList />
              <SheetFooter className="mt-4">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">Fermer</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3 py-2">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span>{user.username}</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            className="justify-start text-white hover:text-airsoft-red"
            onClick={() => navigate('/profile')}
          >
            <UserIcon size={16} className="mr-2" /> Mon profil
          </Button>
          
          <Button 
            variant="ghost" 
            className="justify-start text-white hover:text-airsoft-red"
            onClick={handleNavigateToTeam}
          >
            <Users size={16} className="mr-2" /> Mon équipe
          </Button>
          
          <Button variant="destructive" className="mt-2 bg-airsoft-red hover:bg-red-700" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </div>
    );
  }
};
