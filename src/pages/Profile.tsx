
import React, { useEffect } from 'react';
import { useProfileData } from '../hooks/profile/useProfileData';
import { useEquipmentActions } from '../hooks/profile/useEquipmentActions';
import { useUserGames } from '../hooks/profile/useUserGames';
import { useProfileInitialization } from '../hooks/profile/useProfileInitialization';
import ProfileLoading from '../components/profile/ProfileLoading';
import ProfileLayout from '../components/profile/ProfileLayout';
import { toast } from '@/hooks/use-toast';
import { useUserBadges } from '@/hooks/user-profile/useUserBadges';
import { useUnifiedDialogs } from '@/hooks/profile/useUnifiedDialogs';

const Profile = () => {
  const { user, canFetchData, hasError, setHasError, initialLoading } = useProfileInitialization();
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  const {
    loading,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription,
    fetchProfileData
  } = useProfileData(canFetchData ? user?.id : undefined);

  const {
    equipment,
    fetchEquipment,
    handleAddEquipment
  } = useEquipmentActions(canFetchData ? user?.id : undefined);

  const {
    userGames,
    fetchUserGames
  } = useUserGames(canFetchData ? user?.id : undefined);

  const { userBadges } = useUserBadges(canFetchData ? user?.id : undefined);

  // Hook unifié pour tous les dialogs
  const dialogStates = useUnifiedDialogs();

  useEffect(() => {
    if (canFetchData && user?.id) {
      fetchEquipment();
      fetchUserGames();
    }
  }, [canFetchData, user?.id, fetchEquipment, fetchUserGames]);

  useEffect(() => {
    if (hasError) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement de votre profil."
      });
    }
  }, [hasError]);

  if (initialLoading || !canFetchData || loading || !profileData) {
    return <ProfileLoading />;
  }

  if (hasError) {
    return <div>Une erreur est survenue lors du chargement de votre profil. Veuillez réessayer plus tard.</div>;
  }

  const userWithUpdates = {
    id: user?.id,
    email: user?.email,
    ...profileData,
    updateNewsletterSubscription,
  };

  return (
    <ProfileLayout
      user={userWithUpdates}
      profileData={profileData}
      userStats={userStats}
      equipment={equipment}
      userGames={userGames}
      userBadges={userBadges}
      dialogStates={dialogStates}
      equipmentTypes={equipmentTypes}
      fetchEquipment={fetchEquipment}
      fetchUserGames={fetchUserGames}
      fetchProfileData={fetchProfileData}
      handleAddEquipment={handleAddEquipment}
      handleViewGameDetails={dialogStates.showGameDetails}
      handleViewAllGames={dialogStates.openAllGamesDialog}
      handleViewAllBadges={dialogStates.openBadgesDialog}
      handleGameClickInAllGamesDialog={dialogStates.handleGameClickInAllGamesDialog}
    />
  );
};

export default Profile;
