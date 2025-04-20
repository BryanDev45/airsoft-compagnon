
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '../hooks/useAuth';
import { useProfileData } from '../hooks/useProfileData';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileGames from '../components/profile/ProfileGames';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileEquipment from '../components/profile/ProfileEquipment';
import ProfileBadges from '../components/profile/ProfileBadges';
import ProfileDialogs from '../components/profile/ProfileDialogs';
import ProfileSettingsDialog from '../components/profile/ProfileSettingsDialog';
import ProfileEditMediaDialog from '../components/profile/ProfileEditMediaDialog';
import ProfileEditBioDialog from '../components/profile/ProfileEditBioDialog';
import ProfileAddEquipmentDialog from '../components/profile/ProfileAddEquipmentDialog';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    fetchProfileData
  } = useProfileData(user?.id);

  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [showEditMediaDialog, setShowEditMediaDialog] = React.useState(false);
  const [showEditBioDialog, setShowEditBioDialog] = React.useState(false);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = React.useState(false);
  const [selectedGame, setSelectedGame] = React.useState(null);
  const [showGameDialog, setShowGameDialog] = React.useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = React.useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = React.useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);

  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  React.useEffect(() => {
    if (user?.id) {
      fetchEquipment();
    }
  }, [user?.id]);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const handleStatsUpdate = async (preferredGameType, favoriteRole, level) => {
    return await updateUserStats(preferredGameType, favoriteRole, level);
  };

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
            
            <div className="p-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="games">Mes parties</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  <TabsTrigger value="equipment">Équipement</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileInfo 
                    user={user}
                    profileData={profileData}
                    updateLocation={updateLocation}
                    handleNavigateToTeam={handleNavigateToTeam}
                  />
                </TabsContent>
                
                <TabsContent value="games">
                  <ProfileGames 
                    games={profileData?.games || []} 
                    handleViewGameDetails={(game) => {
                      setSelectedGame(game);
                      setShowGameDialog(true);
                    }}
                    handleViewAllGames={() => setShowAllGamesDialog(true)}
                  />
                </TabsContent>
                
                <TabsContent value="stats">
                  <ProfileStats 
                    userStats={userStats}
                    updateUserStats={handleStatsUpdate}
                    fetchProfileData={fetchProfileData}
                  />
                </TabsContent>
                
                <TabsContent value="equipment">
                  <div className="mb-4 flex justify-end">
                    <Button 
                      onClick={() => setShowAddEquipmentDialog(true)} 
                      className="bg-airsoft-red hover:bg-red-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Ajouter un équipement
                    </Button>
                  </div>
                  
                  <ProfileEquipment 
                    equipment={equipment}
                    readOnly={false}
                    equipmentTypes={equipmentTypes}
                    fetchEquipment={fetchEquipment}
                  />
                </TabsContent>
                
                <TabsContent value="badges">
                  <ProfileBadges 
                    badges={profileData?.badges || []}
                    handleViewAllBadges={() => setShowBadgesDialog(true)}
                  />
                </TabsContent>
              </Tabs>
            </div>
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
