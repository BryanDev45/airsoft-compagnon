
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-airsoft-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/lovable-uploads/1cc60b94-2b6c-4e0e-9ab8-1bd1e8cb1098.png"
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
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/carte" className="text-gray-400 hover:text-white transition-colors">Carte interactive</Link></li>
              <li><Link to="/organisateurs" className="text-gray-400 hover:text-white transition-colors">Espace organisateurs</Link></li>
              <li><Link to="/joueurs" className="text-gray-400 hover:text-white transition-colors">Espace joueurs</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Nous contacter</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Téléchargez l'application</h3>
            <p className="text-gray-400 mb-4">Disponible sur iOS et Android.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#" className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5675 12.0084C17.5545 9.53118 19.6238 8.16451 19.724 8.10386C18.5638 6.45137 16.7846 6.21028 16.1379 6.19591C14.6136 6.04469 13.1378 7.10277 12.3655 7.10277C11.5776 7.10277 10.3709 6.21028 9.06445 6.23902C7.39759 6.26777 5.85646 7.18889 4.98284 8.62083C3.18223 11.5389 4.54889 15.8575 6.27873 18.2904C7.14375 19.4794 8.15054 20.8173 9.46562 20.7598C10.7519 20.6967 11.2287 19.9101 12.7818 19.9101C14.3204 19.9101 14.7685 20.7598 16.1235 20.7254C17.5224 20.6967 18.3821 19.509 19.2038 18.3057C20.1962 16.9391 20.5998 15.6059 20.6128 15.5484C20.5854 15.5341 17.5819 14.3739 17.5675 12.0084Z" />
                  <path d="M15.0537 4.45724C15.7556 3.59262 16.2181 2.41117 16.0744 1.2153C15.0824 1.25842 13.8469 1.89001 13.1164 2.74027C12.4719 3.49125 11.9093 4.7183 12.0673 5.86112C13.1737 5.94742 14.3231 5.30721 15.0537 4.45724Z" />
                </svg>
                App Store
              </a>
              <a href="#" className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.00977 3V21H21.0098V3H3.00977ZM16.4398 16.3L12.0598 13.188L7.70977 16.3V6.2L12.0598 9.312L16.4398 6.2V16.3Z" />
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© Airsoft Compagnon 2025. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Conditions d'utilisation</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Politique de confidentialité</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
