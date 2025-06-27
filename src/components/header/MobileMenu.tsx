
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, Search, Users } from 'lucide-react';
import { AuthSection } from './AuthSection';
import { LanguageSelector } from './LanguageSelector';
import { Separator } from '@/components/ui/separator';

interface MobileMenuProps {
  isOpen: boolean;
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
  userTeamId?: string | null;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  notificationCount,
  handleSheetOpenChange,
  isAuthenticated,
  userTeamId
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-800 z-50 shadow-2xl border-t border-gray-600/50 backdrop-blur-sm">
      <div className="py-6 px-4 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto">
        {/* Navigation Links */}
        <div className="space-y-1">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3 px-2">
            Navigation
          </h3>
          <Link 
            to="/" 
            className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          >
            <Home size={20} />
            <span className="font-medium">Accueil</span>
          </Link>
          <Link 
            to="/parties" 
            className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          >
            <Search size={20} />
            <span className="font-medium">Recherche</span>
          </Link>
          <Link 
            to="/toolbox" 
            className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          >
            <Wrench size={20} />
            <span className="font-medium">ToolBox</span>
          </Link>
          {isAuthenticated && userTeamId && (
            <Link 
              to={`/team/${userTeamId}`} 
              className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
            >
              <Users size={20} />
              <span className="font-medium">Mon équipe</span>
            </Link>
          )}
        </div>
        
        <Separator className="bg-gray-600/50" />
        
        {/* Language Selector */}
        <div className="space-y-1">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3 px-2">
            Langue
          </h3>
          <div className="px-2">
            <LanguageSelector isDesktop={false} />
          </div>
        </div>
        
        <Separator className="bg-gray-600/50" />
        
        {/* Authentication Section */}
        <div className="space-y-1">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3 px-2">
            {isAuthenticated ? 'Mon Compte' : 'Connexion'}
          </h3>
          <div className="px-2">
            <AuthSection 
              isDesktop={false} 
              notificationCount={notificationCount} 
              handleSheetOpenChange={handleSheetOpenChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
