
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfileData } from '../hooks/profile/useProfileData';
import { useEquipmentActions } from '../hooks/profile/useEquipmentActions';
import { useUserGames } from '../hooks/profile/useUserGames';
import { useProfileDialogs } from '../hooks/profile/useProfileDialogs';
import ProfileLoading from '../components/profile/ProfileLoading';
import ProfileLayout from '../components/profile/ProfileLayout';

const Profile = () => {
  const { user, initialLoading } = useAuth();
  const [readyToLoad, setReadyToLoad] = useState(false);
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  // Use effect to set readyToLoad when user is available
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
    updateNewsletterSubscription,
    fetchProfileData
  } = useProfileData(readyToLoad ? user?.id : undefined);

  const { equipment, fetchEquipment, handleAddEquipment } = useEquipmentActions(readyToLoad ? user?.id : undefined);
  const { userGames, fetchUserGames } = useUserGames(readyToLoad ? user?.id : undefined);
  const dialogStates = useProfileDialogs();

  // Only fetch equipment and games when ready to load
  useEffect(() => {
    if (readyToLoad && user?.id) {
      fetchEquipment();
      fetchUserGames();
    }
  }, [readyToLoad, user, fetchEquipment, fetchUserGames]);

  // Show loading state if not ready or still loading
  if (initialLoading || !readyToLoad || loading || !profileData) {
    return <ProfileLoading />;
  }

  // Add updateNewsletterSubscription to the user object for ProfileSettingsDialog
  const userWithUpdates = {
    ...user,
    ...profileData,
    updateNewsletterSubscription
  };

  return (
    <ProfileLayout
      user={userWithUpdates}
      profileData={profileData}
      userStats={userStats}
      equipment={equipment}
      userGames={userGames}
      dialogStates={dialogStates}
      equipmentTypes={equipmentTypes}
      fetchEquipment={fetchEquipment}
      fetchUserGames={fetchUserGames}
      fetchProfileData={fetchProfileData}
      handleAddEquipment={handleAddEquipment}
    />
  );
};

export default Profile;
