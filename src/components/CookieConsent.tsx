
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
    toast({
      title: "Cookies acceptés",
      description: "Vos préférences ont été enregistrées"
    });
  };

  const refuseCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowBanner(false);
    toast({
      title: "Cookies refusés",
      description: "Seuls les cookies essentiels seront utilisés"
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Nous utilisons des cookies</h3>
          <p className="text-sm text-gray-600">
            Ce site utilise des cookies pour améliorer votre expérience. 
            Voir notre <Link to="/cookies-policy" className="text-airsoft-red hover:underline">politique de cookies</Link> pour plus d'informations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refuseCookies}
          >
            Refuser
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-airsoft-red hover:bg-red-700"
            onClick={acceptCookies}
          >
            Accepter
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 sm:hidden" 
          onClick={() => setShowBanner(false)}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
