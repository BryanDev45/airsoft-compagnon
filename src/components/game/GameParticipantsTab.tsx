
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GameParticipant } from '@/types/game';
import ParticipantsPdfButton from './ParticipantsPdfButton';
import { useAuth } from '@/hooks/useAuth';

interface GameParticipantsTabProps {
  participants: GameParticipant[];
  gameTitle?: string;
  gameDate?: string;
  isCreator?: boolean;
}

// Fonction utilitaire pour extraire une valeur propre (identique à celle des fetchers)
const extractCleanValue = (field: any): string | null => {
  if (field === null || field === undefined) {
    return null;
  }
  
  if (typeof field === 'object' && field._type !== undefined && field.value !== undefined) {
    if (field.value === 'undefined' || field.value === null || field.value === undefined) {
      return null;
    }
    return String(field.value);
  }
  
  if (typeof field === 'string') {
    if (field === 'undefined' || field === '' || field.trim() === '') {
      return null;
    }
    return field;
  }
  
  const stringValue = String(field);
  if (stringValue === 'undefined' || stringValue === '' || stringValue === 'null') {
    return null;
  }
  
  return stringValue;
};

const GameParticipantsTab: React.FC<GameParticipantsTabProps> = ({ 
  participants, 
  gameTitle = '', 
  gameDate = '', 
  isCreator = false 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Logique améliorée pour l'affichage des équipes avec nettoyage des données
  const getTeamDisplayName = (participant: GameParticipant): string => {
    const profile = participant.profile;
    if (!profile) {
      console.log('🏷️ TEAM DISPLAY - No profile for participant');
      return 'Aucune équipe';
    }
    
    console.log('🏷️ TEAM DISPLAY - Profile data:', {
      username: profile.username,
      team: profile.team,
      team_id: profile.team_id,
      teamType: typeof profile.team,
      teamIdType: typeof profile.team_id
    });
    
    // Nettoyer les valeurs d'équipe
    const cleanTeamName = extractCleanValue(profile.team);
    const cleanTeamId = extractCleanValue(profile.team_id);
    
    console.log('🏷️ TEAM DISPLAY - Cleaned values:', {
      cleanTeamName,
      cleanTeamId
    });
    
    // Vérifier si on a un nom d'équipe valide nettoyé
    if (cleanTeamName) {
      console.log('🏷️ TEAM DISPLAY - Using clean team name:', cleanTeamName);
      return cleanTeamName;
    }
    
    // Si on a un team_id valide nettoyé mais pas de nom, afficher un message générique
    if (cleanTeamId) {
      console.log('🏷️ TEAM DISPLAY - Using fallback for clean team_id:', cleanTeamId);
      return 'Équipe';
    }
    
    console.log('🏷️ TEAM DISPLAY - No team information available');
    return 'Aucune équipe';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Participants ({participants.length})</h2>
        {isCreator && participants.length > 0 && (
          <ParticipantsPdfButton 
            gameTitle={gameTitle}
            gameDate={gameDate}
            participants={participants}
          />
        )}
      </div>
      
      {participants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">Aucun participant inscrit pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((participant) => {
            const teamDisplayName = getTeamDisplayName(participant);
            
            return (
              <div 
                key={participant.id} 
                className="bg-white p-4 rounded-md border flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                onClick={() => handleProfileClick(participant.profile?.username)}
              >
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage 
                    src={participant.profile?.avatar || ""} 
                    alt={participant.profile?.username || ""}
                  />
                  <AvatarFallback>{getInitials(participant.profile?.username)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">{participant.profile?.username || "Utilisateur"}</div>
                  <div className="text-sm text-gray-500 truncate">{teamDisplayName}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getRoleColor(participant.role)}`}>
                  {participant.role || "Participant"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default GameParticipantsTab;
