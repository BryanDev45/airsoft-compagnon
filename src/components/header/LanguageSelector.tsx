
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

// Define language structure with country codes for flags
const languages = [
  { code: 'fr', name: 'Français', countryCode: 'fr' },
  { code: 'en', name: 'English', countryCode: 'gb' },
  { code: 'de', name: 'Deutsch', countryCode: 'de' },
  { code: 'es', name: 'Español', countryCode: 'es' }
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
            <img
              src={`https://flagcdn.com/h20/${selectedLanguage.countryCode}.png`}
              alt={`${selectedLanguage.name} flag`}
              className="h-4 w-auto rounded-sm"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map(language => (
            <DropdownMenuItem 
              key={language.code} 
              className="flex items-center gap-2"
              onClick={() => handleLanguageChange(language.code)}
            >
              <img
                src={`https://flagcdn.com/h20/${language.countryCode}.png`}
                alt={`${language.name} flag`}
                className="h-4 w-auto rounded-sm"
              />
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
              <img
                src={`https://flagcdn.com/h20/${language.countryCode}.png`}
                alt={`${language.name} flag`}
                className="h-4 w-auto rounded-sm mr-2"
              />
              <span className="text-sm">{language.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
};
