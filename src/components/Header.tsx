
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageWithExpiry, setStorageWithExpiry, clearCacheByPrefix, clearCacheItem, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { Skeleton } from '@/components/ui/skeleton';

// Define language structure with flags
const languages = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸'
  }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id?: string;
    username: string;
    avatar: string;
    teamId?: string;
  } | null>(null);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    // Immediately check the cached auth state for fast UI rendering
    const cachedAuthState = getStorageWithExpiry('auth_state');
    
    // Only proceed with auth check if there's a cached state indicating authentication
    if (cachedAuthState?.isAuthenticated) {
      const cachedUser = getStorageWithExpiry('auth_user');
      const cachedProfile = getStorageWithExpiry('user_profile');
      
      setIsAuthenticated(true);
      
      if (cachedProfile) {
        setUser({
          id: cachedUser?.id,
          username: cachedProfile.username || '',
          avatar: cachedProfile.avatar || '',
          teamId: cachedProfile.team_id
        });
      }
      
      // Setup auth state monitoring only if we think we're authenticated
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed in Header:', event);
        const isAuthValid = !!session;
        setIsAuthenticated(isAuthValid);
        
        // Update cached auth state
        setStorageWithExpiry('auth_state', { isAuthenticated: isAuthValid }, CACHE_DURATIONS.MEDIUM);
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, avatar, team_id')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            const userData = {
              id: session.user.id,
              username: profileData.username || '',
              avatar: profileData.avatar || '',
              teamId: profileData.team_id
            };
            
            setUser(userData);
            
            // Update cache
            setStorageWithExpiry('user_profile', profileData, CACHE_DURATIONS.MEDIUM);
          }
        } else {
          setUser(null);
        }
      });
      
      // Fetch full profile only if we're reasonably sure we're authenticated
      const checkAuth = async () => {
        try {
          // Check auth session
          const { data: { session } } = await supabase.auth.getSession();
          const isAuthValid = !!session;
          
          if (!isAuthValid) {
            // Clear auth state if session is invalid
            setIsAuthenticated(false);
            setUser(null);
            setStorageWithExpiry('auth_state', { isAuthenticated: false }, CACHE_DURATIONS.MEDIUM);
          } else if (session?.user) {
            // Fetch profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, avatar, team_id')
              .eq('id', session.user.id)
              .single();
            
            if (profileData) {
              const userData = {
                id: session.user.id,
                username: profileData.username || '',
                avatar: profileData.avatar || '',
                teamId: profileData.team_id
              };
              
              // Update state
              setUser(userData);
              
              // Update cache
              setStorageWithExpiry('user_profile', profileData, CACHE_DURATIONS.MEDIUM);
            }
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          // In case of error, assume not authenticated
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setIsAuthLoading(false);
        }
      };
      
      // Always set isAuthLoading to false after a short timeout to prevent UI from being stuck
      const timeout = setTimeout(() => {
        setIsAuthLoading(false);
      }, 1000);
      
      checkAuth();
      
      return () => {
        clearTimeout(timeout);
        if (subscription) subscription.unsubscribe();
      };
    } else {
      // If no cached auth state or not authenticated, immediately update the UI
      setIsAuthenticated(false);
      setIsAuthLoading(false);
    }
  }, []);

  // Requête pour récupérer le nombre de notifications non lues avec mise en cache
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      // Try to get from cache first
      const cachedCount = getStorageWithExpiry(`notifications_count_${user.id}`);
      if (cachedCount !== null) {
        return cachedCount;
      }
      
      // If not in cache, fetch from API
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      const countValue = count || 0;
      
      // Update cache
      setStorageWithExpiry(`notifications_count_${user.id}`, countValue, CACHE_DURATIONS.SHORT);
      
      return countValue;
    },
    enabled: isAuthenticated && !!user?.id,
    staleTime: 30000, // 30 secondes avant considérer les données comme obsolètes
    gcTime: 5 * 60 * 1000, // 5 minutes de mise en cache côté React Query
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  // Effet pour rafraîchir le compteur de notifications quand la feuille est fermée
  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      // Rafraîchir les notifications quand on ferme la feuille
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear auth state and user data
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear all auth-related cache
      localStorage.removeItem('auth_state');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user_profile');
      clearCacheByPrefix('notifications');
      clearCacheByPrefix('user_');
      clearCacheByPrefix('profile_');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Airsoft Compagnon"
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogin = () => {
    // Redirect directly to login page
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

  const renderAuthSection = () => {
    // If loading, show a basic login button to ensure users can always access login
    if (isAuthLoading) {
      return (
        <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
          Se connecter
        </Button>
      );
    }
    
    // If authenticated and with user data, show the full interface
    if (isAuthenticated && user) {
      return (
        <>
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
          </DropdownMenu>
        </>
      );
    }
    
    // Default to showing the login button
    return (
      <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
        Se connecter
      </Button>
    );
  };

  return <header className="bg-gradient-to-r from-gray-600 to-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" alt="Airsoft Compagnon Logo" className="h-12" />
            <span style={{
            fontFamily: 'Agency FB, sans-serif'
          }} className="hidden md:block font-bold text-3xl">Airsoft Companion</span>
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
              {languages.map(language => <DropdownMenuItem key={language.code} className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4 ml-4">
            {renderAuthSection()}
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
          
          {/* Ajouter un menu de sélection de langue dans la version mobile */}
          <div className="py-2 text-white">
            <span className="flex items-center gap-2 mb-2">
              <Globe size={18} />
              <span>Langue</span>
            </span>
            <div className="grid grid-cols-2 gap-2 ml-6">
              {languages.map(language => <Button key={language.code} variant="ghost" className="justify-start text-white hover:text-airsoft-red">
                  <span className="mr-2 text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </Button>)}
            </div>
          </div>

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
