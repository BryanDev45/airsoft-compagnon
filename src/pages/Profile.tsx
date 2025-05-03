
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

  const { equipment, fetchEquipment, handleAddEquipment } = useEquipmentActions(user?.id);
  const { userGames, fetchUserGames } = useUserGames(user?.id);
  const dialogStates = useProfileDialogs();

  useEffect(() => {
    if (readyToLoad) {
      fetchEquipment();
      fetchUserGames();
    }
  }, [readyToLoad]);

  if (initialLoading || !readyToLoad || loading || !profileData) {
    return <ProfileLoading />;
  }

  return (
    <ProfileLayout
      user={user}
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
