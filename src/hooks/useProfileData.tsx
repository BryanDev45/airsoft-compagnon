
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { useUserProfile } from './useUserProfile';
import { useAuth } from './useAuth';
import { equipmentTypes } from '../utils/mockData';

export const useProfileData = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, stats, loading: profileLoading, updateProfile } = useUserProfile();
  
  const [editing, setEditing] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Formatage des données du profil pour correspondre à la structure attendue
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    if (profile && stats) {
      const formattedUser = {
        id: profile.id,
        username: profile.username,
        fullName: `${profile.firstname} ${profile.lastname}`,
        firstName: profile.firstname,
        lastName: profile.lastname,
        age: profile.age,
        email: profile.email,
        avatar: profile.avatar || '/placeholder.svg',
        bio: profile.bio || '',
        location: profile.location || '',
        memberSince: profile.join_date || new Date().toISOString().split('T')[0],
        team: profile.team || '',
        teamId: profile.team_id || '',
        joinDate: profile.join_date || '',
        verified: profile.is_verified || false,
        premium: false,
        games: [], // À remplir avec les vraies données
        allGames: [], // À remplir avec les vraies données
        stats: {
          gamesPlayed: stats.games_played || 0,
          wins: 0,
          losses: 0,
          winRate: stats.win_rate || '0%',
          accuracy: stats.accuracy || '0%',
          eliminations: 0,
          objectivesCaptured: stats.objectives_completed || 0,
          timeOnPoint: 0,
          flagsRecovered: stats.flags_captured || 0,
          preferredGameType: stats.preferred_game_type || 'CQB',
          favoriteRole: stats.favorite_role || 'Assaut',
          operations: stats.operations || 0,
          sundayGames: stats.sunday_games || 0
        },
        equipment: [], // À remplir avec les vraies données
        badges: []  // À remplir avec les vraies données
      };
      
      setUserData(formattedUser);
      setLoading(false);
    }
  }, [profile, stats]);

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
    if (userData?.teamId) {
      navigate(`/team/${userData.teamId}`);
    } else {
      toast({
        title: "Information",
        description: "Vous n'êtes pas membre d'une équipe."
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return {
    user: userData,
    loading: loading || profileLoading,
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
