
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Cog, Calendar, Map, LogOut, Menu, X, Bell, Search, Flag, Plus } from 'lucide-react';
import { NotificationList } from './notifications/NotificationList';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

const Header = () => {
  const { toast } = useToast();
  const { user, logout, initialLoading } = useAuth();
  const { isMobile } = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Drapeau pour chaque langue
  const langFlags = {
    fr: "🇫🇷",
    en: "🇬🇧",
    de: "🇩🇪",
    es: "🇪🇸",
    it: "🇮🇹"
  };

  const fetchUserProfile = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: fetchUserProfile,
    enabled: !!user,
  });

  const { data: notifications = [], isLoading: loadingNotifications } = useQuery({
    queryKey: ['notificationsCount'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const unreadNotifications = notifications?.length || 0;

  useEffect(() => {
    if (profile && !userProfile) {
      setUserProfile(profile);
    }
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const handleOpenMobileMenu = () => {
    setMobileMenuOpen(true);
    // Empêcher le défilement du contenu derrière le menu
    document.body.style.overflow = 'hidden';
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
    // Réactiver le défilement
    document.body.style.overflow = '';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png"
                alt="Airsoft"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Airsoft</span>
            </Link>

            {!isMobile && (
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/parties" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/parties' ? 'text-airsoft-red' : 'text-gray-700 hover:text-airsoft-red'}`}>
                  <Calendar className="h-4 w-4 inline-block mr-1" />
                  Parties
                </Link>
                <Link to="/team" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith('/team') ? 'text-airsoft-red' : 'text-gray-700 hover:text-airsoft-red'}`}>
                  <User className="h-4 w-4 inline-block mr-1" />
                  Équipe
                </Link>
                <Link to="/toolbox" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/toolbox' ? 'text-airsoft-red' : 'text-gray-700 hover:text-airsoft-red'}`}>
                  <Cog className="h-4 w-4 inline-block mr-1" />
                  Outils
                </Link>
                <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/contact' ? 'text-airsoft-red' : 'text-gray-700 hover:text-airsoft-red'}`}>
                  <Map className="h-4 w-4 inline-block mr-1" />
                  Contact
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {!initialLoading && (
              <>
                {!user ? (
                  <div className="space-x-2 flex items-center">
                    {!isMobile && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <Flag className="h-4 w-4 mr-1" />
                            <span>{langFlags["fr"]} Français</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <span>{langFlags["fr"]} Français</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["en"]} English</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["de"]} Deutsch</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["es"]} Español</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["it"]} Italiano</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Link to="/login">
                      <Button variant="outline" size={isMobile ? "sm" : "default"}>
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="bg-airsoft-red hover:bg-red-700" size={isMobile ? "sm" : "default"}>
                        Inscription
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/parties')} className="hidden sm:inline-flex">
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Rechercher</span>
                    </Button>

                    {!isMobile && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center">
                              <Flag className="h-4 w-4 mr-1" />
                              <span>{langFlags["fr"]} Français</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <span>{langFlags["fr"]} Français</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span>{langFlags["en"]} English</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span>{langFlags["de"]} Deutsch</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span>{langFlags["es"]} Español</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span>{langFlags["it"]} Italiano</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                              <Bell className="h-5 w-5" />
                              {unreadNotifications > 0 && (
                                <span className="absolute top-0 right-0 inline-block h-4 w-4 rounded-full bg-airsoft-red text-[10px] font-bold text-white flex items-center justify-center transform translate-x-1 -translate-y-1">
                                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </span>
                              )}
                              <span className="sr-only">Notifications</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-80 h-[400px]">
                            <NotificationList />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full p-0 h-10 w-10">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={userProfile?.avatar || '/placeholder.svg'} alt="Avatar" />
                            <AvatarFallback>
                              {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="sr-only">Profil</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userProfile?.username || 'Utilisateur'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Mon profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/parties')}>
                          <Search className="mr-2 h-4 w-4" />
                          <span>Recherche</span>
                        </DropdownMenuItem>
                        {isMobile && (
                          <>
                            <DropdownMenuItem onClick={() => navigate('/parties')}>
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Parties</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/team')}>
                              <User className="mr-2 h-4 w-4" />
                              <span>Équipe</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/toolbox')}>
                              <Cog className="mr-2 h-4 w-4" />
                              <span>Outils</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Déconnexion</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {isMobile && (
                      <Button variant="ghost" size="sm" className="ml-2" onClick={handleOpenMobileMenu}>
                        <Menu className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu - Slide in from right */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 flex z-50">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={handleCloseMobileMenu}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white shadow-xl transform transition-transform ease-in-out duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={handleCloseMobileMenu}
              >
                <span className="sr-only">Fermer le menu</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <img
                src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png"
                alt="Airsoft"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold">Airsoft</span>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <Link
                  to="/parties"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === '/parties'
                      ? 'bg-gray-100 text-airsoft-red'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-airsoft-red'
                  }`}
                  onClick={handleCloseMobileMenu}
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Parties
                </Link>

                <Link
                  to="/team"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname.startsWith('/team')
                      ? 'bg-gray-100 text-airsoft-red'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-airsoft-red'
                  }`}
                  onClick={handleCloseMobileMenu}
                >
                  <User className="mr-3 h-6 w-6" />
                  Équipe
                </Link>

                <Link
                  to="/toolbox"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === '/toolbox'
                      ? 'bg-gray-100 text-airsoft-red'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-airsoft-red'
                  }`}
                  onClick={handleCloseMobileMenu}
                >
                  <Cog className="mr-3 h-6 w-6" />
                  Outils
                </Link>

                <Link
                  to="/contact"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === '/contact'
                      ? 'bg-gray-100 text-airsoft-red'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-airsoft-red'
                  }`}
                  onClick={handleCloseMobileMenu}
                >
                  <Map className="mr-3 h-6 w-6" />
                  Contact
                </Link>

                {user && (
                  <>
                    <div className="pt-4">
                      <div className="px-2 py-2 text-base font-medium text-gray-500">Notifications</div>
                      <Card className="m-2">
                        <CardContent className="max-h-[250px] overflow-auto p-2">
                          <NotificationList />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start">
                            <Flag className="mr-3 h-5 w-5" />
                            <span>{langFlags["fr"]} Français</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <span>{langFlags["fr"]} Français</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["en"]} English</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["de"]} Deutsch</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["es"]} Español</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>{langFlags["it"]} Italiano</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
