
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { mockUserData, equipmentTypes } from '../utils/mockData';

export const useProfileData = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  
  // Use mock data
  const user = mockUserData;

  const handleViewGameDetails = (game: any) => {
    setSelectedGame(game);
    setShowGameDialog(true);
  };

  const handleViewAllGames = () => {
    setShowAllGamesDialog(true);
  };

  const handleViewAllBadges = () => {
    setShowBadgesDialog(true);
  };

  const handleNavigateToGame = (gameId: number) => {
    setShowGameDialog(false);
    setShowAllGamesDialog(false);
    navigate(`/game/${gameId}`);
  };

  const handleNavigateToTeam = () => {
    navigate(`/team/${user.teamId}`);
  };

  const handleLogout = () => {
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    });
    
    navigate('/login');
  };

  return {
    user,
    editing,
    setEditing,
    selectedGame,
    setSelectedGame,
    showGameDialog,
    setShowGameDialog,
    showAllGamesDialog,
    setShowAllGamesDialog,
    showBadgesDialog,
    setShowBadgesDialog,
    equipmentTypes,
    handleViewGameDetails,
    handleViewAllGames,
    handleViewAllBadges,
    handleNavigateToGame,
    handleNavigateToTeam,
    handleLogout
  };
};
