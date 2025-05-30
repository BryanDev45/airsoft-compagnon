import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Instagram, Facebook } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

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
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <img src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" alt="Airsoft Compagnon Logo" className="h-12" />
              <span className="text-lg font-bold">Airsoft Companion</span>
            </div>
            <p className="text-gray-400 mb-4 text-center md:text-left">
              Trouvez facilement vos parties d'airsoft, vos magasins et rejoignez une communauté passionnée.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                <Instagram className="w-6 h-6" />
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
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              
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
          
          <div className="text-center flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Téléchargez l'application</h3>
            <p className="text-gray-400 mb-4">Disponible sous forme d'application web progressive (PWA).</p>
            <div className="flex justify-center">
              <Button variant="outline" className="bg-airsoft-red hover:bg-red-700 text-white px-6 py-3 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2" size="lg">
                <Download size={20} />
                Installer l'application (PWA)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© Airsoft Companion 2025. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            
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
