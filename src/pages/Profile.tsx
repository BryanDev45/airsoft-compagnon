
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useProfileData } from '../hooks/profile/useProfileData';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileContainer from '../components/profile/ProfileContainer';
import ProfileDialogs from '../components/profile/ProfileDialogs';
import ProfileSettingsDialog from '../components/profile/ProfileSettingsDialog';
import ProfileEditMediaDialog from '../components/profile/ProfileEditMediaDialog';
import ProfileEditBioDialog from '../components/profile/ProfileEditBioDialog';
import ProfileAddEquipmentDialog from '../components/profile/ProfileAddEquipmentDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();

  const [readyToLoad, setReadyToLoad] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [userGames, setUserGames] = useState<any[]>([]);

  useEffect(() => {
    if (!initialLoading && user?.id) {
      setReadyToLoad(true);
    }
  }, [initialLoading, user]);

  const {
    loading,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    fetchProfileData
  } = useProfileData(readyToLoad ? user?.id : null);

  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showEditMediaDialog, setShowEditMediaDialog] = useState(false);
  const [showEditBioDialog, setShowEditBioDialog] = useState(false);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);

  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  useEffect(() => {
    if (readyToLoad) {
      fetchEquipment();
      fetchUserGames();
    }
  }, [readyToLoad]);

  const fetchUserGames = async () => {
    if (!user?.id) return;
    
    try {
      // 1. Fetch games where the user is a participant
      const { data: gameParticipants, error: participantsError } = await supabase
        .from('game_participants')
        .select('*, game_id')
        .eq('user_id', user.id);
        
      if (participantsError) throw participantsError;
      
      // 2. Fetch games created by the user
      const { data: createdGames, error: createdGamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', user.id);
        
      if (createdGamesError) throw createdGamesError;
      
      console.log("Created games:", createdGames);
      console.log("Participated games:", gameParticipants);
      
      let formattedGames: any[] = [];
      
      // 3. Format participated games
      if (gameParticipants && gameParticipants.length > 0) {
        const gameIds = gameParticipants.map(gp => gp.game_id);
        
        if (gameIds.length > 0) {
          const { data: games, error: gamesDataError } = await supabase
            .from('airsoft_games')
            .select('*')
            .in('id', gameIds);
            
          if (gamesDataError) throw gamesDataError;
          
          if (games && games.length > 0) {
            const participatedGames = gameParticipants.map(gp => {
              const gameData = games.find(g => g.id === gp.game_id);
              if (gameData) {
                return {
                  id: gameData.id,
                  title: gameData.title,
                  date: new Date(gameData.date).toLocaleDateString('fr-FR'),
                  location: gameData.city,
                  image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
                  role: gp.role,
                  status: new Date(gameData.date) > new Date() ? 'À venir' : 'Terminé',
                  team: 'Indéfini',
                  result: gp.status
                };
              }
              return null;
            }).filter(Boolean);
            
            formattedGames = [...formattedGames, ...participatedGames];
          }
        }
      }
      
      // 4. Format created games
      if (createdGames && createdGames.length > 0) {
        const organizedGames = createdGames.map(game => ({
          id: game.id,
          title: game.title,
          date: new Date(game.date).toLocaleDateString('fr-FR'),
          location: game.city,
          image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
          role: 'Organisateur',
          status: new Date(game.date) > new Date() ? 'À venir' : 'Terminé',
          team: 'Organisateur',
          result: 'Organisateur'
        }));
        
        formattedGames = [...formattedGames, ...organizedGames];
      }
      
      // 5. Update the games_organized count in user_stats if needed
      if (createdGames && createdGames.length > 0) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', user.id);
          
        if (updateError) {
          console.error("Error updating games_organized count:", updateError);
        } else {
          console.log("Updated games_organized count to:", createdGames.length);
          // Refresh profile data to update stats
          fetchProfileData();
        }
      }
      
      // Remove duplicates
      formattedGames = formattedGames.filter((game, index, self) => 
        index === self.findIndex(g => g.id === game.id)
      );
      
      console.log("Final formatted games:", formattedGames);
      setUserGames(formattedGames);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des parties:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'équipement:", error);
    }
  };

  const handleAddEquipment = async (newEquipment) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .insert({
          ...newEquipment,
          user_id: user?.id
        });

      if (error) throw error;

      toast({
        title: "Équipement ajouté",
        description: "Votre équipement a été ajouté avec succès"
      });

      await fetchEquipment();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'équipement",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    } else {
      navigate('/team/create');
    }
  };

  const handleNavigateToGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  if (initialLoading || !readyToLoad || loading || !profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Chargement du profil...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ProfileHeader 
              user={profileData}
              isOwnProfile={true}
              setEditing={() => setShowEditMediaDialog(true)}
              toggleProfileSettings={() => setShowSettingsDialog(true)}
              onEditBio={() => setShowEditBioDialog(true)}
            />
            
            <ProfileContainer
              user={user}
              profileData={profileData}
              userStats={userStats}
              equipment={equipment}
              games={userGames} 
              updateLocation={updateLocation}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              fetchEquipment={fetchEquipment}
              fetchUserGames={fetchUserGames}
              handleNavigateToTeam={handleNavigateToTeam}
              setSelectedGame={setSelectedGame}
              setShowGameDialog={setShowGameDialog}
              setShowAllGamesDialog={setShowAllGamesDialog}
              setShowBadgesDialog={setShowBadgesDialog}
              setShowAddEquipmentDialog={setShowAddEquipmentDialog}
              isOwnProfile={true}
              equipmentTypes={equipmentTypes}
            />
          </div>
        </div>
      </main>
      <Footer />

      <ProfileDialogs 
        selectedGame={selectedGame}
        showGameDialog={showGameDialog}
        setShowGameDialog={setShowGameDialog}
        showAllGamesDialog={showAllGamesDialog}
        setShowAllGamesDialog={setShowAllGamesDialog}
        showBadgesDialog={showBadgesDialog}
        setShowBadgesDialog={setShowBadgesDialog}
        user={profileData}
        handleNavigateToGame={handleNavigateToGame}
      />

      <ProfileSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        user={profileData}
      />

      <ProfileEditMediaDialog
        open={showEditMediaDialog}
        onOpenChange={setShowEditMediaDialog}
      />
      
      <ProfileEditBioDialog
        open={showEditBioDialog}
        onOpenChange={setShowEditBioDialog}
        currentBio={profileData?.bio || ''}
        currentUsername={profileData?.username || ''}
      />
      
      <ProfileAddEquipmentDialog
        open={showAddEquipmentDialog}
        onOpenChange={setShowAddEquipmentDialog}
        onAddEquipment={handleAddEquipment}
        equipmentTypes={equipmentTypes}
      />
    </div>
  );
};

export default Profile;
