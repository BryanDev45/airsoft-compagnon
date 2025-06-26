
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

  // Only fetch data when we can and user exists - prevent infinite loops
  const shouldFetch = canFetchData && user?.id;

  const {
    loading,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription,
    fetchProfileData
  } = useProfileData(shouldFetch ? user.id : undefined);

  const {
    equipment,
    fetchEquipment,
    handleAddEquipment
  } = useEquipmentActions(shouldFetch ? user.id : undefined);

  // Use the optimized hook without duplication
  const {
    userGames,
    fetchUserGames
  } = useUserGames(shouldFetch ? user.id : undefined);

  const { userBadges } = useUserBadges(shouldFetch ? user.id : undefined);

  // Hook unifié pour tous les dialogs
  const dialogStates = useUnifiedDialogs();

  // Only fetch equipment and games once when component mounts and user is available
  useEffect(() => {
    if (shouldFetch) {
      console.log('Profile: Fetching equipment and games for user:', user.id);
      fetchEquipment();
      fetchUserGames();
    }
  }, [shouldFetch, user?.id]); // Removed fetchEquipment and fetchUserGames from deps to prevent loops

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
