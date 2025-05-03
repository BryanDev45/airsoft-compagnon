
import React from 'react';
import { Calendar, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Game {
  id: string;
  title: string;
  date: string;
  status: string;
  role: string;
}

interface ProfileGamesProps {
  games: Game[];
  handleViewGameDetails: (game: Game) => void;
  handleViewAllGames: () => void;
}

const ProfileGames = ({ games, handleViewGameDetails, handleViewAllGames }: ProfileGamesProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mes parties</CardTitle>
            <CardDescription>
              Historique et parties à venir
            </CardDescription>
          </div>
          <Link to="/parties/create">
            <Button className="bg-airsoft-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Créer une partie
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {games && games.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              Vous n'avez pas encore participé à des parties.
            </p>
          ) : (
            games && games.map(game => (
              <div 
                key={game.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{game.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {game.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} /> {game.role || 'Participant'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    className={
                      game.status === "À venir" 
                        ? "bg-blue-500" 
                        : game.status === "Terminé" 
                        ? "bg-gray-500" 
                        : "bg-green-500"
                    }
                  >
                    {game.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                    onClick={() => handleViewGameDetails(game)}
                  >
                    Détails
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="bg-airsoft-red hover:bg-red-700"
          onClick={handleViewAllGames}
        >
          Voir toutes mes parties
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileGames;
