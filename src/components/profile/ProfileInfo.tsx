
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Star } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const ProfileInfo = ({ user, editing, setEditing, handleNavigateToTeam }) => {
  const handleLeaveTeam = () => {
    if (confirm("Êtes-vous sûr de vouloir quitter l'équipe ?")) {
      toast({
        title: "Équipe quittée",
        description: "Vous avez quitté l'équipe avec succès"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          {user.team && (
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">Équipe:</span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto hover:text-airsoft-red"
                  onClick={handleNavigateToTeam}
                >
                  {user.team}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLeaveTeam}
                title="Quitter l'équipe"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Nom</span>
                <p className="text-gray-900">{user.lastName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Prénom</span>
                <p className="text-gray-900">{user.firstName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Âge</span>
                <p className="text-gray-900">{user.age} ans</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Localisation</span>
                <p className="text-gray-900">{user.location}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Date de création du compte</span>
                <p className="text-gray-900">{user.memberSince}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Note moyenne</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${
                        index < Math.floor(user.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({user.rating || 0}/5)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileInfo;
