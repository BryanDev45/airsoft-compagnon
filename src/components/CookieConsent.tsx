
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, X } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-airsoft-red flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-1">Nous utilisons des cookies</h3>
            <p className="text-sm text-gray-600">
              Nous utilisons des cookies pour améliorer votre expérience, personnaliser le contenu et les publicités, fournir des fonctionnalités de médias sociaux et analyser notre trafic.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDecline}
            className="whitespace-nowrap"
          >
            Refuser
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onAccept}
            className="whitespace-nowrap bg-airsoft-red hover:bg-red-700"
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
