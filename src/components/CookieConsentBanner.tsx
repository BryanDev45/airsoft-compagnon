
import React, { useState, useEffect } from 'react';
import CookieConsent from './CookieConsent';

const CookieConsentBanner: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('cookieConsent');
    if (!consentChoice) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    console.log('Cookies accepted');
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
    console.log('Cookies declined');
  };

  if (!showConsent) {
    return null;
  }

  return (
    <CookieConsent 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
};

export default CookieConsentBanner;
