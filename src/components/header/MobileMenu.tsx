
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { AuthSection } from './AuthSection';
import { LanguageSelector } from './LanguageSelector';

interface MobileMenuProps {
  isOpen: boolean;
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  notificationCount,
  handleSheetOpenChange,
  isAuthenticated
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 z-50 shadow-lg border-t border-gray-700">
      <div className="py-4 px-6 space-y-4">
        {/* Navigation Links */}
        <div className="space-y-2">
          <Link 
            to="/" 
            className="block py-3 px-2 text-white hover:text-airsoft-red hover:bg-gray-800 rounded-md transition-colors"
          >
            Accueil
          </Link>
          <Link 
            to="/parties" 
            className="block py-3 px-2 text-white hover:text-airsoft-red hover:bg-gray-800 rounded-md transition-colors"
          >
            Recherche
          </Link>
          <Link 
            to="/toolbox" 
            className="flex items-center gap-2 py-3 px-2 text-white hover:text-airsoft-red hover:bg-gray-800 rounded-md transition-colors"
          >
            <Wrench size={18} />
            <span>ToolBox</span>
          </Link>
        </div>
        
        {/* Separator */}
        <div className="border-t border-gray-700"></div>
        
        {/* Language Selector */}
        <div className="py-2">
          <LanguageSelector isDesktop={false} />
        </div>
        
        {/* Separator */}
        <div className="border-t border-gray-700"></div>
        
        {/* Authentication Section */}
        <div className="py-2">
          <AuthSection 
            isDesktop={false} 
            notificationCount={notificationCount} 
            handleSheetOpenChange={handleSheetOpenChange} 
          />
        </div>
      </div>
    </div>
  );
};
