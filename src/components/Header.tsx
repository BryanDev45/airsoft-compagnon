
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, ChevronDown, User, LogOut, Bell, Settings, Menu, X, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationList from './notifications/NotificationList';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar, username')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;

        if (profile) {
          setUserAvatar(profile.avatar);
          setUsername(profile.username);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!user?.id) return;

      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);
        
        if (error) throw error;
        
        if (count !== null) {
          setNotificationCount(count);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` },
        () => fetchNotificationCount()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` },
        () => fetchNotificationCount()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Flags for language selection
  const languageOptions = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent md:bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="font-bold text-2xl text-airsoft-red">AirsoftPRO</Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-gray-700 hover:text-airsoft-red font-medium ${location.pathname === '/' ? 'text-airsoft-red' : ''}`}>Accueil</Link>
          <Link to="/parties" className={`text-gray-700 hover:text-airsoft-red font-medium ${location.pathname === '/parties' ? 'text-airsoft-red' : ''}`}>Parties</Link>
          <Link to="/toolbox" className={`text-gray-700 hover:text-airsoft-red font-medium ${location.pathname === '/toolbox' ? 'text-airsoft-red' : ''}`}>Boîte à outils</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 bg-transparent hover:bg-transparent hover:text-airsoft-red">
                <span className="text-gray-700 font-medium">Plus</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/faq" className="w-full">FAQ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/contact" className="w-full">Contact</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/partners" className="w-full">Partenaires</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* User Menu & Actions */}
        <div className="flex items-center space-x-1 md:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Globe className="h-5 w-5 mr-1" />
                <span className="sr-only md:not-sr-only md:inline-block">FR</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languageOptions.map(lang => (
                <DropdownMenuItem key={lang.code} className="cursor-pointer flex items-center">
                  <span className="mr-2 text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {!loading && user ? (
            <>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-2 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-airsoft-red text-white">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-md overflow-hidden z-50">
                    <NotificationList onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-8 w-8 overflow-hidden rounded-full">
                    <Avatar>
                      <AvatarImage src={userAvatar || '/placeholder.svg'} />
                      <AvatarFallback>{username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : !loading ? (
            <Button onClick={() => navigate('/login')} className="bg-airsoft-red hover:bg-red-700">
              Connexion
            </Button>
          ) : null}

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden px-2"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col py-4">
            <Link to="/" className="px-6 py-3 hover:bg-gray-100">Accueil</Link>
            <Link to="/parties" className="px-6 py-3 hover:bg-gray-100">Parties</Link>
            <Link to="/toolbox" className="px-6 py-3 hover:bg-gray-100">Boîte à outils</Link>
            <Link to="/faq" className="px-6 py-3 hover:bg-gray-100">FAQ</Link>
            <Link to="/contact" className="px-6 py-3 hover:bg-gray-100">Contact</Link>
            <Link to="/partners" className="px-6 py-3 hover:bg-gray-100">Partenaires</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
