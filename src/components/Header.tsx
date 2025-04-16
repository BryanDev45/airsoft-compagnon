
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // État d'authentification basé sur localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    avatar: string;
  } | null>(null);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count

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
  
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "Fonctionnalité en cours de développement"
    });
    // Reset notification count after clicking
    setNotificationCount(0);
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
          <Link to="/parties" className="hover:text-airsoft-red transition-colors">Parties</Link>
          <Link to="/contact" className="hover:text-airsoft-red transition-colors">Contact</Link>
          <div className="flex items-center gap-4 ml-4">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleNotificationClick}
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
                    Mon profil
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
          <Link to="/parties" className="hover:text-airsoft-red py-2 transition-colors">Parties</Link>
          <Link to="/contact" className="hover:text-airsoft-red py-2 transition-colors">Contact</Link>
          
          {isAuthenticated && (
            <div className="flex items-center py-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-white"
                onClick={handleNotificationClick}
              >
                <Bell size={18} />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <Badge className="bg-airsoft-red">{notificationCount}</Badge>
                )}
              </Button>
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
              <Link to="/profile" className="hover:text-airsoft-red py-2 transition-colors">
                Mon profil
              </Link>
              <Link to="/parties" className="hover:text-airsoft-red py-2 transition-colors">
                Mes parties
              </Link>
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
