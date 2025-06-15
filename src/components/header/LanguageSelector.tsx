
import React, { useState } from 'react';
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
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  // Language selection functionality would be implemented here
  const handleLanguageChange = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    if (language) {
      setSelectedLanguage(language);
    }
    console.log(`Language changed to ${code}`);
    // Implementation for language switching would go here
  };

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1.5 text-white px-2">
            <Globe className="h-5 w-5" />
            <span className="text-lg" style={{ fontFamily: 'sans-serif' }}>{selectedLanguage.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map(language => (
            <DropdownMenuItem 
              key={language.code} 
              className="flex items-center gap-2"
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="text-lg" style={{ fontFamily: 'sans-serif' }}>{language.flag}</span>
              <span>{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    // Mobile layout - Improved version
    return (
      <div className="text-white">
        <div className="flex items-center gap-2 mb-3 text-gray-300">
          <Globe size={18} />
          <span className="font-medium">Langue</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map(language => (
            <Button 
              key={language.code} 
              variant="ghost" 
              size="sm"
              className={`justify-start text-white hover:text-airsoft-red hover:bg-gray-800 p-2 h-auto ${selectedLanguage.code === language.code ? 'bg-gray-700' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="mr-2 text-base">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
};
