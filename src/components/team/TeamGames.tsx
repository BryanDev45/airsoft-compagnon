
import React from 'react';
import { Calendar, MapPin, Trophy, Users, Flag } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamGamesProps {
  upcomingGames: any[];
  pastGames: any[];
}

const TeamGames = ({ upcomingGames, pastGames }: TeamGamesProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="text-airsoft-red" size={20} />
          Parties à venir
        </h3>
        {upcomingGames.length > 0 ? (
          <div className="space-y-4">
            {upcomingGames.map((game: any) => (
              <Card key={game.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{game.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {game.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {game.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {game.participants} participants
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="bg-airsoft-red hover:bg-red-700 text-white"
                    >
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            Aucune partie à venir
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Flag className="text-airsoft-red" size={20} />
          Parties passées
        </h3>
        {pastGames.length > 0 ? (
          <div className="space-y-4">
            {pastGames.map((game: any) => (
              <Card key={game.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{game.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {game.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {game.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy size={14} className="text-yellow-500" /> {game.result}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                    >
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            Aucune partie passée
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamGames;
