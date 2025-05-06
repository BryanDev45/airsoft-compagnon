
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import type { GameParticipant } from '@/types/game';

interface GameParticipantsCardProps {
  participants: GameParticipant[];
  isLoading: boolean;
  onViewAllClick: () => void;
}

const GameParticipantsCard: React.FC<GameParticipantsCardProps> = ({
  participants,
  isLoading,
  onViewAllClick
}) => {
  // Helper function to get initials from username
  const getInitials = (username: string | null): string => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Participants ({participants?.length || 0})</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : participants?.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {participants.slice(0, 8).map((participant, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage 
                        src={participant.profile?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} 
                        alt={participant.profile?.username || "Participant"} 
                        className="w-10 h-10 object-cover" 
                      />
                      <AvatarFallback>{getInitials(participant.profile?.username)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
              
              {participants.length > 8 && (
                <>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <span className="text-sm text-gray-500 font-medium">+{participants.length - 9}</span>
                  </div>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={onViewAllClick}
            >
              Voir tous les participants
            </Button>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <User size={48} className="mx-auto mb-2 opacity-30" />
            <p>Aucun participant inscrit pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameParticipantsCard;
