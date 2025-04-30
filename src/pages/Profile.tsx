
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useProfileData } from '../hooks/useProfileData';
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
    }
  }, [readyToLoad]);

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
              updateLocation={updateLocation}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              fetchEquipment={fetchEquipment}
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
