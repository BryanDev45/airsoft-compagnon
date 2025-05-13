
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GameParticipant } from '@/types/game';

interface GameParticipantsTabProps {
  participants: GameParticipant[];
}

const GameParticipantsTab: React.FC<GameParticipantsTabProps> = ({ participants }) => {
  const navigate = useNavigate();

  // Helper function to get initials from username
  const getInitials = (username: string | null): string => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case 'Organisateur':
        return 'bg-blue-100 text-blue-800';
      case 'Arbitre':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleProfileClick = (username: string | null) => {
    if (username) {
      navigate(`/user/${username}`);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Participants ({participants.length})</h2>
      
      {participants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">Aucun participant inscrit pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((participant) => (
            <div 
              key={participant.id} 
              className="bg-white p-4 rounded-md border flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleProfileClick(participant.profile?.username)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={participant.profile?.avatar || ""} 
                  alt={participant.profile?.username || ""}
                />
                <AvatarFallback>{getInitials(participant.profile?.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="font-medium">{participant.profile?.username || "Utilisateur"}</div>
                <div className="text-sm text-gray-500">{participant.profile?.team || "Aucune équipe"}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(participant.role)}`}>
                {participant.role || "Participant"}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default GameParticipantsTab;
