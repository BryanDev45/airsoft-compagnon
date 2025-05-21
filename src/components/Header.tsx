
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AuthSection } from './header/AuthSection';
import { LanguageSelector } from './header/LanguageSelector';
import { MobileMenu } from './header/MobileMenu';
import { useNotifications } from './header/useNotifications';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notificationCount, handleSheetOpenChange } = useNotifications();
  const { user, initialLoading } = useAuth();
  
  const isAuthenticated = !!user;

  return (
    <header className="bg-gradient-to-r from-gray-600 to-gray-900 text-white sticky top-0 z-50">
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

          <LanguageSelector />

          <div className="flex items-center gap-4 ml-4">
            <AuthSection 
              notificationCount={notificationCount} 
              handleSheetOpenChange={handleSheetOpenChange} 
            />
          </div>
        </nav>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen} 
        notificationCount={notificationCount}
        handleSheetOpenChange={handleSheetOpenChange}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
};

export default Header;
