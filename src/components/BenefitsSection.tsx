
import React from 'react';
import { Users, Calendar, Search, Shield, Clock, BadgePercent } from 'lucide-react';

const BenefitCard = ({ title, description, icon, color }: { title: string; description: string; icon: React.ReactNode; color: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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
        {/* Avantages pour les organisateurs */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-airsoft-red to-red-600 text-white p-6 md:p-10 rounded-lg mb-8 relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-500/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-900/20 to-transparent"></div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl font-bold mb-6 leading-tight">
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
                  <p className="text-lg font-semibold">
                    Réduisez le taux d'absentéisme grâce à la validation des inscriptions après le paiement de la PAF.
                  </p>
                </div>
              </div>
              <div className="md:w-1/3 flex-shrink-0">
                <img 
                  src="/lovable-uploads/84404d08-fa37-4317-80e0-d607d3676fd5.png" 
                  alt="Joueurs d'airsoft en équipement militaire" 
                  className="rounded-lg w-full h-full object-cover shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
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
        
        {/* Avantages pour les joueurs */}
        <div>
          <div className="bg-airsoft-dark text-white p-6 md:p-10 rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Quels avantages pour les joueurs ?</h2>
              <p className="text-lg mb-4">
                Fini les recherches interminables. Accédez instantanément à toutes les parties et magasins qui se trouvent autour de vous.
              </p>
              <p className="text-lg">
                Simplifiez le règlement de votre PAF et retrouvez tous les détails de vos événements passés et à venir.
                Créez votre profil, montrez votre équipement et faites partie d'une équipe.
                Collectionnez différents badges pour démontrer votre engagement envers la communauté.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BenefitCard
              title="Recherche géolocalisée"
              description="Trouvez instantanément toutes les parties et magasins d'airsoft autour de vous."
              icon={<Search className="text-white" size={24} />}
              color="bg-airsoft-dark"
            />
            <BenefitCard
              title="Paiement simplifié"
              description="Réglez vos PAF en quelques clics et gardez une trace de tous vos événements."
              icon={<Clock className="text-white" size={24} />}
              color="bg-airsoft-dark"
            />
            <BenefitCard
              title="Communauté active"
              description="Rejoignez une communauté de passionnés et partagez votre expérience avec d'autres joueurs."
              icon={<Users className="text-white" size={24} />}
              color="bg-airsoft-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
