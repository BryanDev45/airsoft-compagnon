
import React from 'react';
import ProfileEditBioDialog from './ProfileEditBioDialog';
import ProfileAddEquipmentDialog from './ProfileAddEquipmentDialog';
import ProfileEditEquipmentDialog from './ProfileEditEquipmentDialog';
import ProfileEditMediaDialog from './ProfileEditMediaDialog';
import ProfileSettingsDialog from './ProfileSettingsDialog';

interface ProfileDialogsProps {
  dialogStates: any;
  user: any;
  currentBio: any;
  currentUsername: any;
  equipmentTypes: any;
  handleAddEquipment: any;
  updateNewsletterSubscription: any;
}

const ProfileDialogs = ({
  dialogStates,
  user,
  currentBio,
  currentUsername,
  equipmentTypes,
  handleAddEquipment,
  updateNewsletterSubscription
}: ProfileDialogsProps) => {
  const {
    showEditBioDialog,
    setShowEditBioDialog,
    showSettingsDialog,
    setShowSettingsDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
    showEditEquipmentDialog,
    setShowEditEquipmentDialog,
    showEditMediaDialog,
    setShowEditMediaDialog,
    selectedEquipment,
    selectedMedia
  } = dialogStates;

  return (
    <>
      <ProfileEditBioDialog
        open={showEditBioDialog}
        onOpenChange={setShowEditBioDialog}
        currentBio={currentBio}
        currentUsername={currentUsername}
      />
      
      <ProfileSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        user={user}
        updateNewsletterSubscription={updateNewsletterSubscription}
      />
      
      <ProfileAddEquipmentDialog
        open={showAddEquipmentDialog}
        onOpenChange={setShowAddEquipmentDialog}
        userId={user?.id}
        onAddEquipment={handleAddEquipment}
        equipmentTypes={equipmentTypes}
      />
      
      <ProfileEditEquipmentDialog
        open={showEditEquipmentDialog}
        onOpenChange={setShowEditEquipmentDialog}
        equipment={selectedEquipment}
        equipmentTypes={equipmentTypes}
      />
      
      <ProfileEditMediaDialog
        open={showEditMediaDialog}
        onOpenChange={setShowEditMediaDialog}
        media={selectedMedia}
      />
    </>
  );
};

export default ProfileDialogs;
