
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-airsoft-dark text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png"
              alt="Airsoft Compagnon Logo"
              className="h-12"
            />
            <span className="hidden md:block text-lg font-bold">Airsoft Compagnon</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-airsoft-red transition-colors">Accueil</Link>
          <Link to="/parties" className="hover:text-airsoft-red transition-colors">Parties</Link>
          <Link to="/contact" className="hover:text-airsoft-red transition-colors">Contact</Link>
          <div className="flex items-center gap-2 ml-4">
            <Link to="/login">
              <Button variant="default" className="bg-airsoft-red hover:bg-red-700">
                Se connecter
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-airsoft-dark z-50 py-4 px-6 flex flex-col gap-4 shadow-lg">
          <Link to="/" className="hover:text-airsoft-red py-2 transition-colors">Accueil</Link>
          <Link to="/parties" className="hover:text-airsoft-red py-2 transition-colors">Parties</Link>
          <Link to="/contact" className="hover:text-airsoft-red py-2 transition-colors">Contact</Link>
          <Link to="/login" className="w-full">
            <Button variant="default" className="bg-airsoft-red hover:bg-red-700 w-full mt-2">
              Se connecter
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
