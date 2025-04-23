import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Bell, BellOff, Settings, Users, Wrench, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from "@/components/ui/sheet";
import { NotificationList } from '@/components/notifications/NotificationList';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id?: string; // Ajout de l'ID comme propriété optionnelle
    username: string;
    avatar: string;
    teamId?: string;
  } | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user) {
        const {
          data: profileData
        } = await supabase.from('profiles').select('username, avatar, team_id').eq('id', session.user.id).single();
        setUser({
          id: session.user.id,
          // Stockage de l'ID de l'utilisateur
          username: profileData?.username || '',
          avatar: profileData?.avatar || '',
          teamId: profileData?.team_id
        });
      }
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const {
          data: profileData
        } = await supabase.from('profiles').select('username, avatar, team_id').eq('id', session.user.id).single();
        setUser({
          id: session.user.id,
          // Stockage de l'ID de l'utilisateur
          username: profileData?.username || '',
          avatar: profileData?.avatar || '',
          teamId: profileData?.team_id
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur Airsoft Compagnon"
    });
    navigate('/login');
  };
  const handleLogin = () => {
    navigate('/login');
  };
  const handleNavigateToTeam = () => {
    if (user?.teamId) {
      navigate(`/team/${user.teamId}`);
    } else {
      toast({
        title: "Information",
        description: "Vous n'êtes pas membre d'une équipe"
      });
    }
  };
  const handleNavigateToToolbox = () => {
    navigate('/toolbox');
  };
  const {
    data: notificationCount = 0,
    isLoading: isLoadingNotifications
  } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      if (!user?.id) return 0;
      const {
        count,
        error
      } = await supabase.from('notifications').select('id', {
        count: 'exact',
        head: true
      }).eq('user_id', user.id).eq('read', false);
      if (error) throw error;
      return count || 0;
    },
    enabled: isAuthenticated && !!user?.id
  });
  return <header className="bg-gradient-to-r from-gray-600 to-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" alt="Airsoft Compagnon Logo" className="h-12" />
            <span style={{
            fontFamily: 'Agency FB, sans-serif'
          }} className="hidden md:block font-bold text-2xl">Airsoft Compagnon</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-airsoft-red transition-colors">Accueil</Link>
          <Link to="/parties" className="hover:text-airsoft-red transition-colors">Recherche</Link>
          <Link to="/toolbox" className="hover:text-airsoft-red transition-colors">ToolBox</Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Français</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Deutsch</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4 ml-4">
            {isAuthenticated && <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} className="text-white hover:text-airsoft-red transition-colors" />
                    {notificationCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-airsoft-red">
                        {notificationCount}
                      </Badge>}
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
              </Sheet>}

            {isAuthenticated && user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
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
              </DropdownMenu> : <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
                Se connecter
              </Button>}
          </div>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 z-50 py-4 px-6 flex flex-col gap-4 shadow-lg">
          <Link to="/" className="hover:text-airsoft-red py-2 transition-colors">Accueil</Link>
          <Link to="/parties" className="hover:text-airsoft-red py-2 transition-colors">Recherche</Link>
          <Link to="/toolbox" className="hover:text-airsoft-red py-2 transition-colors flex items-center gap-2">
            <Wrench size={18} />
            <span>ToolBox</span>
          </Link>

          {isAuthenticated && <div className="flex items-center py-2">
              <Sheet>
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
            </div>}

          {isAuthenticated && user ? <>
              <div className="flex items-center gap-3 py-2">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
              </div>
              <Link to="/profile" className="hover:text-airsoft-red py-2 transition-colors flex items-center gap-2">
                <UserIcon size={16} /> Mon profil
              </Link>
              <div onClick={handleNavigateToTeam} className="hover:text-airsoft-red py-2 transition-colors flex items-center gap-2 cursor-pointer">
                <Users size={16} /> Mon équipe
              </div>
              <Button variant="destructive" className="mt-2 bg-airsoft-red hover:bg-red-700" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
              </Button>
            </> : <Button variant="default" className="bg-airsoft-red hover:bg-red-700 w-full mt-2" onClick={handleLogin}>
              Se connecter
            </Button>}
        </div>}
    </header>;
};
export default Header;