
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, Users } from "lucide-react";

interface GameListProps {
  games: any[];
}

export const GameList: React.FC<GameListProps> = ({ games }) => {
  if (!games || games.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Aucune partie à afficher
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {games.slice(0, 3).map((game, index) => (
        <Card key={game.id || index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{game.title}</CardTitle>
              <Badge variant={game.status === 'À venir' ? 'default' : 'secondary'}>
                {game.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{game.date}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{game.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{game.role || 'Participant'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {games.length > 3 && (
        <div className="text-center">
          <a href="#" className="text-sm text-muted-foreground hover:underline">
            Voir toutes les parties ({games.length})
          </a>
        </div>
      )}
    </div>
  );
};
