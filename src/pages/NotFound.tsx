
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-airsoft-red to-red-600 p-6 text-white">
            <h1 className="text-4xl font-bold flex items-center">
              <AlertTriangle className="mr-4 h-10 w-10" />
              Erreur 404
            </h1>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
            <p className="text-gray-600 mb-6">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              Vérifiez l'URL ou utilisez les liens ci-dessous pour vous diriger vers 
              une page existante.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link 
                to="/" 
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center text-center"
              >
                <span className="text-lg font-medium mb-1">Accueil</span>
                <span className="text-sm text-gray-500">Retourner à la page d'accueil</span>
              </Link>
              
              <Link 
                to="/parties" 
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center text-center"
              >
                <span className="text-lg font-medium mb-1">Parties</span>
                <span className="text-sm text-gray-500">Découvrir les parties disponibles</span>
              </Link>
              
              <Link 
                to="/toolbox" 
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center text-center"
              >
                <span className="text-lg font-medium mb-1">ToolBox</span>
                <span className="text-sm text-gray-500">Outils et calculateurs pour l'airsoft</span>
              </Link>
              
              <Link 
                to="/contact" 
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center text-center"
              >
                <span className="text-lg font-medium mb-1">Contact</span>
                <span className="text-sm text-gray-500">Contactez notre équipe</span>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <Button 
                asChild
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Link to="/">
                  <ArrowLeft size={16} />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
