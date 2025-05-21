
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

// Define language structure with flags
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

interface LanguageSelectorProps {
  isDesktop?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isDesktop = true }) => {
  // Language selection functionality would be implemented here
  const handleLanguageChange = (code: string) => {
    console.log(`Language changed to ${code}`);
    // Implementation for language switching would go here
  };

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map(language => (
            <DropdownMenuItem 
              key={language.code} 
              className="flex items-center gap-2"
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    // Mobile layout
    return (
      <div className="py-2 text-white">
        <span className="flex items-center gap-2 mb-2">
          <Globe size={18} />
          <span>Langue</span>
        </span>
        <div className="grid grid-cols-2 gap-2 ml-6">
          {languages.map(language => (
            <Button 
              key={language.code} 
              variant="ghost" 
              className="justify-start text-white hover:text-airsoft-red"
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="mr-2 text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
};
