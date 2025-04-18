
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
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
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Team info with leave button */}
          {user.team && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Équipe:</span>
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
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Nom:</span>
                <p>{user.lastName}</p>
              </div>
              <div>
                <span className="font-medium">Prénom:</span>
                <p>{user.firstName}</p>
              </div>
              <div>
                <span className="font-medium">Âge:</span>
                <p>{user.age} ans</p>
              </div>
              <div>
                <span className="font-medium">Localisation:</span>
                <p>{user.location}</p>
              </div>
              <div>
                <span className="font-medium">Date de création du compte:</span>
                <p>{user.memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileInfo;
