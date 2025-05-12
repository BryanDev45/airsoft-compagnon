
import React from 'react';
import ProfileSettingsDialog from './ProfileSettingsDialog';
import ProfileEditBioDialog from './ProfileEditBioDialog';
import ProfileAddEquipmentDialog from './ProfileAddEquipmentDialog';

const ProfileDialogs = ({
  dialogStates,
  user,
  currentBio,
  currentUsername,
  equipmentTypes,
  handleAddEquipment,
  updateNewsletterSubscription
}) => {
  const {
    showSettingsDialog,
    setShowSettingsDialog,
    showEditBioDialog,
    setShowEditBioDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
  } = dialogStates;

  return (
    <>
      {/* Paramètres du compte */}
      <ProfileSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        user={user}
        updateNewsletterSubscription={updateNewsletterSubscription}
      />
      
      {/* Édition de la bio */}
      <ProfileEditBioDialog
        open={showEditBioDialog}
        onOpenChange={setShowEditBioDialog}
        currentBio={currentBio || ''}
        currentUsername={currentUsername || ''}
      />
      
      {/* Ajout d'équipement */}
      <ProfileAddEquipmentDialog
        open={showAddEquipmentDialog}
        onOpenChange={setShowAddEquipmentDialog}
        equipmentTypes={equipmentTypes}
        onAddEquipment={handleAddEquipment}
      />
    </>
  );
};

export default ProfileDialogs;
