
import React from 'react';
import { Facebook, Instagram, Mail, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-airsoft-red text-white p-8 md:p-12 rounded-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Où nous retrouver ?</h2>
            <p className="text-lg mb-8">
              Retrouvez-nous sur l'iOS Store ou le Play Store, mais également sur les réseaux sociaux avec Facebook et Instagram afin d'être au courant des dernières actualités et de ne rien louper.
            </p>
            
            <div className="flex flex-wrap gap-6">
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
              <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <Facebook size={20} />
                Facebook
              </a>
              <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <Instagram size={20} />
                Instagram
              </a>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-airsoft-red">
                <Mail className="mr-2" size={18} />
                Nous contacter
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-airsoft-red">
                <MessageSquare className="mr-2" size={18} />
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
