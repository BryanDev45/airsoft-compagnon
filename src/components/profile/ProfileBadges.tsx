
import React from 'react';
import { Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileBadgesProps {
  badges: any[];
  handleViewAllBadges: () => void;
}

const ProfileBadges = ({ badges, handleViewAllBadges }: ProfileBadgesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="text-airsoft-red" size={20} />
          Mes badges
        </CardTitle>
        <CardDescription>
          Badges et récompenses débloqués
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="border rounded-lg p-4 flex flex-col items-center text-center"
              style={{ 
                backgroundColor: badge.backgroundColor,
                borderColor: badge.borderColor
              }}
            >
              <img 
                src={badge.icon} 
                alt={badge.name} 
                className="w-16 h-16 mb-3"
              />
              <h3 className="font-semibold mb-1">{badge.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
              <p className="text-xs text-gray-500">Obtenu le {badge.date}</p>
            </div>
          ))}
        </div>
        
        {badges.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">Vous n'avez pas encore obtenu de badges</p>
            <p className="text-sm text-gray-400 mt-1">Participez à des parties et complétez des objectifs pour en obtenir</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={handleViewAllBadges}
            className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
          >
            Voir tous les badges disponibles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBadges;
