
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import Parties from './pages/Parties';
import GameDetails from './pages/GameDetails';
import Partners from './pages/Partners';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import TermsOfSale from './pages/TermsOfSale';
import CookiesPolicy from './pages/CookiesPolicy';
import FAQ from './pages/FAQ';
import CreateParty from './pages/CreateParty';
import Team from './pages/Team';
import Toolbox from './pages/Toolbox';
import AuthGuard from './components/auth/AuthGuard';
import CreateTeam from './pages/CreateTeam';
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from './components/CookieConsent';

function App() {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const consentStatus = localStorage.getItem('cookieConsent');
    setCookiesAccepted(consentStatus === 'accepted');
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookiesAccepted(true);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setCookiesAccepted(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/parties/create" element={<CreateParty />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/terms-of-sale" element={<TermsOfSale />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/team/:id" element={<Team />} />
        <Route path="/team/create" element={<CreateTeam />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/search" element={<Parties />} />
        <Route 
          path="/profile" 
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {cookiesAccepted === null && (
        <CookieConsent 
          onAccept={handleAcceptCookies}
          onDecline={handleDeclineCookies}
        />
      )}
      
      <Toaster />
    </Router>
  );
}

export default App;
