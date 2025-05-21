
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
    <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 z-50 py-4 px-6 flex flex-col gap-4 shadow-lg">
      <Link to="/" className="hover:text-airsoft-red py-2 transition-colors">Accueil</Link>
      <Link to="/parties" className="hover:text-airsoft-red py-2 transition-colors">Recherche</Link>
      <Link to="/toolbox" className="hover:text-airsoft-red py-2 transition-colors flex items-center gap-2">
        <Wrench size={18} />
        <span>ToolBox</span>
      </Link>
      
      <LanguageSelector isDesktop={false} />
      
      <AuthSection 
        isDesktop={false} 
        notificationCount={notificationCount} 
        handleSheetOpenChange={handleSheetOpenChange} 
      />
    </div>
  );
};
