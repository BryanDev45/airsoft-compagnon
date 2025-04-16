import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Badge } from "@/components/ui/badge";
import { Check, User } from 'lucide-react';
import { CalendarDays, MapPin, Flag } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ProfileSummary />
              <ProfileDetails />
            </div>
            <div>
              <ProfileBadges />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ProfileSummary = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <img
          src="https://via.placeholder.com/80"
          alt="Avatar"
          className="rounded-full w-20 h-20 mr-4"
        />
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-600">@johndoe</p>
        </div>
      </div>
      <p className="text-gray-700">
        Bienvenue sur votre profil ! Ici, vous pouvez gérer vos informations personnelles,
        voir vos statistiques et découvrir vos badges.
      </p>
    </div>
  );
};

const ProfileDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold mb-4">Informations Personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-gray-600 mb-2">
            <User className="inline-block w-4 h-4 mr-1" />
            Nom:
          </div>
          <div className="font-semibold">John Doe</div>
        </div>
        <div>
          <div className="text-gray-600 mb-2">
            <Mail className="inline-block w-4 h-4 mr-1" />
            Email:
          </div>
          <div className="font-semibold">john.doe@example.com</div>
        </div>
        <div>
          <div className="text-gray-600 mb-2">
            <CalendarDays className="inline-block w-4 h-4 mr-1" />
            Date de naissance:
          </div>
          <div className="font-semibold">01/01/1990</div>
        </div>
        <div>
          <div className="text-gray-600 mb-2">
            <MapPin className="inline-block w-4 h-4 mr-1" />
            Localisation:
          </div>
          <div className="font-semibold">Paris, France</div>
        </div>
      </div>
    </div>
  );
};

const ProfileBadges = () => {
  const badges = [
    {
      id: 1,
      name: "Team Leader",
      description: "Chef d'équipe",
      icon: <Check className="w-10 h-10 text-airsoft-red" />
    },
    {
      id: 2,
      name: "Profil Vérifié",
      description: "Identité vérifiée",
      icon: <User className="w-10 h-10 text-green-500" />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Mes Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center p-4 border rounded-lg">
            {badge.icon}
            <span className="font-semibold mt-2">{badge.name}</span>
            <span className="text-sm text-gray-500">{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
