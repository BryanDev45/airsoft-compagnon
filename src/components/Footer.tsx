import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer = () => {
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
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.207-1.504.344-1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/parties" className="text-gray-400 hover:text-white transition-colors">Recherche</Link></li>
              <li><Link to="/toolbox" className="text-gray-400 hover:text-white transition-colors">ToolBox</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Se connecter</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">S'inscrire</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Téléchargez l'application</h3>
            <p className="text-gray-400 mb-4">Disponible sous forme d'application web progressive (PWA).</p>
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
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© Airsoft Compagnon 2025. Tous droits réservés.</p>
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
