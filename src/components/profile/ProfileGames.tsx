
import React from 'react';
import { Calendar, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatGameDate } from '@/utils/dateUtils';

interface Game {
  id: string;
  title: string;
  date: string;
  status: string;
  role: string;
  participants?: number;
  maxParticipants?: number;
  price?: number;
  location?: string;
  time?: string;
  // Propriétés héritées pour compatibilité
  participantsCount?: number;
  max_players?: number;
  address?: string;
  city?: string;
  zip_code?: string;
  end_date?: string;
}

interface ProfileGamesProps {
  games: Game[];
  handleViewGameDetails: (game: Game) => void;
  handleViewAllGames: () => void;
}

const ProfileGames = ({
  games,
  handleViewGameDetails,
  handleViewAllGames
}: ProfileGamesProps) => {
  // Tri des parties : d'abord les parties à venir, puis les parties passées
  const sortedGames = React.useMemo(() => {
    if (!games || games.length === 0) return [];
    return [...games].sort((a, b) => {
      // Parties "À venir" en premier
      if (a.status === "À venir" && b.status !== "À venir") return -1;
      if (a.status !== "À venir" && b.status === "À venir") return 1;

      // Si les deux sont à venir ou les deux sont passées, tri par date (du plus récent au plus ancien)
      const dateA = a.date.split('/').reverse().join('-'); // Convertir format FR (jj/mm/aaaa) en format ISO (aaaa-mm-jj)
      const dateB = b.date.split('/').reverse().join('-');
      return dateB > dateA ? 1 : -1;
    });
  }, [games]);

  // Limiter à 10 parties pour l'affichage principal
  const displayedGames = sortedGames.slice(0, 10);

  const handleGameDetailsClick = (game: Game) => {
    console.log('🎮 PROFILE GAMES - Button clicked for game:', game);
    console.log('🎮 PROFILE GAMES - Game object keys:', Object.keys(game || {}));
    console.log('🎮 PROFILE GAMES - Current route:', window.location.pathname);
    console.log('🎮 PROFILE GAMES - Game ID check:', {
      'game.id': game.id,
      'game.game_id': (game as any).game_id,
      'game.party_id': (game as any).party_id,
    });
    
    handleViewGameDetails(game);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-left">Mes parties</CardTitle>
            <CardDescription>
              {games.length > 10 ? `${sortedGames.slice(0, 10).length} dernières parties sur ${games.length} au total` : 'Historique et parties à venir'}
            </CardDescription>
          </div>
          <Link to="/parties/create" className="w-full sm:w-auto">
            <Button className="bg-airsoft-red hover:bg-red-700 w-full">
              <Plus className="h-4 w-4 mr-2" />
              Créer une partie
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedGames && displayedGames.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              Vous n'avez pas encore participé à des parties.
            </p>
          ) : (
            displayedGames && displayedGames.map(game => (
              <div key={game.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-left">{game.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {formatGameDate(game.date, game.end_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} /> {game.role || 'Participant'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge className={game.status === "À venir" ? "bg-blue-500" : game.status === "Terminé" ? "bg-gray-500" : "bg-green-500"}>
                    {game.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white" 
                    onClick={() => handleGameDetailsClick(game)}
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
          className="bg-airsoft-red hover:bg-red-700 w-full sm:w-auto" 
          onClick={handleViewAllGames} 
          disabled={games.length === 0}
        >
          Voir toutes mes parties {games.length > 0 && `(${games.length})`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileGames;
