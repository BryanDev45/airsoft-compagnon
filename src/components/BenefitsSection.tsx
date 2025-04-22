
import React from 'react';
import { Users, Calendar, Search, Shield, Clock, BadgePercent, Trophy, Crosshair, Target, Download, Facebook, Instagram, Mail, MessageSquare, MapPin, CreditCard, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const BenefitCard = ({ title, description, icon, color }: { title: string; description: string; icon: React.ReactNode; color: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div className={`rounded-full w-12 h-12 flex items-center justify-center ${color} mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const BenefitsSection = () => {
  return (
    <div className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Avantages pour les organisateurs - Modifié avec l'image de fond */}
        <div className="mb-16">
          <div className="bg-airsoft-dark text-white p-6 md:p-10 rounded-lg mb-8 relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
            <div className="absolute inset-0">
              <img 
                src="/lovable-uploads/84404d08-fa37-4317-80e0-d607d3676fd5.png" 
                alt="Joueurs d'airsoft en équipement" 
                className="object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-airsoft-dark via-airsoft-dark/90 to-airsoft-dark/80"></div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="md:w-1/3 lg:w-1/4 mb-6 md:mb-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/84404d08-fa37-4317-80e0-d607d3676fd5.png" 
                  alt="Joueurs d'airsoft en équipement" 
                  className="rounded-lg shadow-lg border-4 border-white/10"
                />
              </div>
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-block bg-airsoft-red px-4 py-1 rounded-full mb-4">
                  <Trophy className="inline-block mr-2 h-5 w-5 text-white" />
                  <span className="text-white font-semibold">Pour les organisateurs</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Quels avantages pour les organisateurs ?
                </h2>
                
                <div className="space-y-4">
                  <p className="text-lg opacity-90">
                    Vous en avez assez de gaspiller votre temps dans la gestion des inscriptions ?
                  </p>
                  <p className="text-lg opacity-90">
                    Airsoft Compagnon s'occupe de tout pour vous. Déposez simplement votre annonce et c'est tout !
                    Les joueurs trouvent automatiquement votre annonce grâce à nos filtres et tous les paiements de PAF sont gérés par l'application.
                  </p>
                  <p className="text-lg font-semibold bg-airsoft-red/20 p-4 rounded-lg border border-airsoft-red/30">
                    Réduisez le taux d'absentéisme grâce à la validation des inscriptions après le paiement de la PAF.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BenefitCard
              title="Gestion simplifiée"
              description="Gérez facilement vos inscriptions et vos paiements sans effort administratif."
              icon={<Calendar className="text-white" size={24} />}
              color="bg-airsoft-red"
            />
            <BenefitCard
              title="Visibilité maximale"
              description="Vos parties sont automatiquement mises en avant auprès des joueurs de votre région."
              icon={<Search className="text-white" size={24} />}
              color="bg-airsoft-red"
            />
            <BenefitCard
              title="Réduction d'absentéisme"
              description="Le système de paiement anticipé permet de réduire considérablement les absences de dernière minute."
              icon={<Shield className="text-white" size={24} />}
              color="bg-airsoft-red"
            />
          </div>
        </div>
        
        {/* Nouvelle tuile pour les joueurs - Déplacée après les avantages organisateurs */}
        <div className="mb-16">
          <div className="bg-airsoft-dark text-white p-6 md:p-10 rounded-lg mb-8 relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-airsoft-dark via-airsoft-dark to-airsoft-dark/70 z-0"></div>
            <div className="absolute inset-0 opacity-20">
              <img 
                src="/lovable-uploads/364d4f7f-8b4d-4ff8-bdd4-3257db537d1e.png"
                alt="Fond airsoft"
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-block bg-airsoft-red px-4 py-1 rounded-full mb-4">
                <Users className="inline-block mr-2 h-5 w-5 text-white" />
                <span className="text-white font-semibold">Pour les joueurs</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Découvrez une nouvelle façon de vivre l'airsoft
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-airsoft-red flex-shrink-0 mt-1" />
                    <p className="text-lg">Fini les recherches interminables. Accédez instantanément à toutes les parties et magasins qui se trouvent autour de vous.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-6 h-6 text-airsoft-red flex-shrink-0 mt-1" />
                    <p className="text-lg">Simplifiez le règlement de votre PAF et retrouvez tous les détails de vos événements passés et à venir.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-airsoft-red flex-shrink-0 mt-1" />
                    <p className="text-lg">Créez votre profil, montrez votre équipement et faites partie d'une équipe.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-airsoft-red flex-shrink-0 mt-1" />
                    <p className="text-lg">Collectionnez différents badges pour démontrer votre engagement envers la communauté.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Contact */}
        <div className="bg-airsoft-dark text-white p-6 md:p-10 rounded-lg mb-8 relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-airsoft-dark via-airsoft-dark to-airsoft-dark/70 z-0"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full">
            <img 
              src="/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png" 
              alt="Joueur d'airsoft en action" 
              className="object-cover h-full w-full opacity-50 mix-blend-overlay"
            />
          </div>
          
          <div className="relative z-10">
            <div className="inline-block bg-airsoft-red px-4 py-1 rounded-full mb-4">
              <Users className="inline-block mr-2 h-5 w-5 text-white" />
              <span className="text-white font-semibold">Rejoignez-nous</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Où nous retrouver ?</h2>
            <p className="text-lg mb-8 opacity-90">
              Retrouvez-nous sur les réseaux sociaux avec Facebook et Instagram afin d'être au courant des dernières actualités et de ne rien louper.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                className="bg-airsoft-red hover:bg-red-700 text-white border-white hover:bg-white hover:text-airsoft-red transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                Installer l'application (PWA)
              </Button>
              <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors border border-white/20">
                <Facebook size={20} />
                Facebook
              </a>
              <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors border border-white/20">
                <Instagram size={20} />
                Instagram
              </a>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button className="bg-airsoft-red text-white hover:bg-red-700 border border-white">
                  <Mail className="mr-2" size={18} />
                  Nous contacter
                </Button>
              </Link>
              <Link to="/faq">
                <Button className="bg-airsoft-red text-white hover:bg-red-700 border border-white">
                  <MessageSquare className="mr-2" size={18} />
                  FAQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
