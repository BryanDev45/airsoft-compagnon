import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <footer className="bg-airsoft-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png"
                alt="Airsoft Compagnon Logo"
                className="h-12"
              />
              <span className="text-lg font-bold">Airsoft Compagnon</span>
            </div>
            <p className="text-gray-400 mb-4">
              Trouvez facilement vos parties d'airsoft, vos magasins et rejoignez une communauté passionnée.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0 2.717.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5 902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link>
              <Link to="/parties" className="text-gray-400 hover:text-white transition-colors">Recherche</Link>
              <Link to="/toolbox" className="text-gray-400 hover:text-white transition-colors">ToolBox</Link>
              <Link to="/partners" className="text-gray-400 hover:text-white transition-colors">Nos partenaires</Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Mon profil</Link>
                  <Link to="/teams" className="text-gray-400 hover:text-white transition-colors">Mon équipe</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Se connecter</Link>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors">S'inscrire</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Téléchargez l'application</h3>
            <p className="text-gray-400 mb-4">Disponible sous forme d'application web progressive (PWA).</p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="bg-airsoft-red hover:bg-red-700 text-white px-6 py-3 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2" 
                size="lg"
              >
                <Download size={20} />
                Installer l'application (PWA)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© Airsoft Compagnon 2025. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/partners" className="text-gray-400 hover:text-white text-sm transition-colors">Nos partenaires</Link>
            <Link to="/terms-of-use" className="text-gray-400 hover:text-white text-sm transition-colors">Conditions d'utilisation</Link>
            <Link to="/terms-of-sale" className="text-gray-400 hover:text-white text-sm transition-colors">Conditions de vente</Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Politique de confidentialité</Link>
            <Link to="/cookies-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
