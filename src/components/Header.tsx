
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Bell, BellOff, Settings, Users, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // État d'authentification basé sur localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    avatar: string;
    teamId?: string;
  } | null>(null);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouvelle partie disponible",
      message: "Une nouvelle partie a été ajoutée près de chez vous",
      date: "Aujourd'hui, 10:30",
      read: false,
      link: "/recherche"
    },
    {
      id: 2,
      title: "Demande d'ami",
      message: "AirsoftMaster souhaite vous ajouter comme ami",
      date: "Hier, 15:45",
      read: false,
      link: "/profile"
    },
    {
      id: 3,
      title: "Mise à jour du règlement",
      message: "Le règlement de la partie 'Opération Forêt Noire' a été mis à jour",
      date: "16/04/2025, 08:15",
      read: false,
      link: "/parties/1"
    }
  ]);

  // Vérifier l'état d'authentification au chargement du composant
  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    const userState = localStorage.getItem('user');
    if (authState === 'true' && userState) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userState));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);
  
  const handleLogout = () => {
    // Effacer les données d'authentification
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');

    // Mettre à jour l'état
    setIsAuthenticated(false);
    setUser(null);

    // Afficher un message de confirmation
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur Airsoft Compagnon"
    });

    // Rediriger vers la page de connexion
    navigate('/login');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };

  const handleNavigateToTeam = () => {
    // Navigate to the user's team page
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

  const handleNotificationRead = (id: number) => {
    // Marquer une notification comme lue
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? {...notif, read: true} : notif
      )
    );
    
    // Mettre à jour le compteur
    setNotificationCount(prev => Math.max(0, prev - 1));
  };
  
  const handleReadAllNotifications = () => {
    // Marquer toutes les notifications comme lues
    setNotifications(prev => 
      prev.map(notif => ({...notif, read: true}))
    );
    
    // Remettre le compteur à zéro
    setNotificationCount(0);
    
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues"
    });
  };
  
  const handleNotificationClick = (link: string) => {
    navigate(link);
  };
  
  return (
    <header className="bg-airsoft-dark text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" alt="Airsoft Compagnon Logo" className="h-12" />
            <span className="hidden md:block text-lg font-bold">Airsoft Compagnon</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-airsoft-red transition-colors">Accueil</Link>
          <Link to="/recherche" className="hover:text-airsoft-red transition-colors">Recherche</Link>
          <Link to="/contact" className="hover:text-airsoft-red transition-colors">Contact</Link>
          <Link to="/toolbox" className="hover:text-airsoft-red transition-colors flex items-center gap-1">
            <Toolbox size={18} />
            <span>ToolBox</span>
          </Link>
          <div className="flex items-center gap-4 ml-4">
            {isAuthenticated && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                  >
                    <Bell size={20} className="text-white hover:text-airsoft-red transition-colors" />
                    {notificationCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-airsoft-red"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="text-xl flex items-center justify-between">
                      <span>Notifications</span>
                      <Button 
                        variant="ghost" 
                        className="text-sm h-8 px-2"
                        onClick={handleReadAllNotifications}
                      >
                        Marquer tout comme lu
                      </Button>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'} cursor-pointer transition-colors hover:bg-gray-100`}
                          onClick={() => {
                            handleNotificationRead(notification.id);
                            handleNotificationClick(notification.link);
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <p className="text-xs text-gray-500">{notification.date}</p>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <BellOff className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500">Vous n'avez aucune notification</p>
                      </div>
                    )}
                  </div>
                  <SheetFooter className="mt-4">
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full">Fermer</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            )}
            
            {isAuthenticated && user ? (
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
            ) : (
              <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
                Se connecter
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-airsoft-dark z-50 py-4 px-6 flex flex-col gap-4 shadow-lg">
          <Link to="/" className="hover:text-airsoft-red py-2 transition-colors">Accueil</Link>
          <Link to="/recherche" className="hover:text-airsoft-red py-2 transition-colors">Recherche</Link>
          <Link to="/contact" className="hover:text-airsoft-red py-2 transition-colors">Contact</Link>
          <Link to="/toolbox" className="hover:text-airsoft-red py-2 transition-colors flex items-center gap-2">
            <Toolbox size={18} />
            <span>ToolBox</span>
          </Link>
          
          {isAuthenticated && (
            <div className="flex items-center py-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 text-white"
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                    {notificationCount > 0 && (
                      <Badge className="bg-airsoft-red">{notificationCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl flex items-center justify-between">
                      <span>Notifications</span>
                      <Button 
                        variant="ghost" 
                        className="text-sm h-8 px-2"
                        onClick={handleReadAllNotifications}
                      >
                        Tout lire
                      </Button>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'} cursor-pointer transition-colors hover:bg-gray-100`}
                          onClick={() => {
                            handleNotificationRead(notification.id);
                            handleNotificationClick(notification.link);
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <p className="text-xs text-gray-500">{notification.date}</p>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <BellOff className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500">Vous n'avez aucune notification</p>
                      </div>
                    )}
                  </div>
                  <SheetFooter className="mt-4">
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full">Fermer</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          )}
          
          {isAuthenticated && user ? (
            <>
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
            </>
          ) : (
            <Button variant="default" className="bg-airsoft-red hover:bg-red-700 w-full mt-2" onClick={handleLogin}>
              Se connecter
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
