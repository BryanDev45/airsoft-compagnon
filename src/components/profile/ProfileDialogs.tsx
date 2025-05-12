
import React from 'react';
import ProfileEditBioDialog from './ProfileEditBioDialog';
import ProfileAddEquipmentDialog from './ProfileAddEquipmentDialog';
import ProfileEditEquipmentDialog from './ProfileEditEquipmentDialog';
import ProfileEditMediaDialog from './ProfileEditMediaDialog';
import ProfileSettingsDialog from './ProfileSettingsDialog';

interface ProfileDialogsProps {
  dialogStates: any;
  user: any;
  currentBio: string;
  currentUsername: string;
  equipmentTypes: string[];
  handleAddEquipment: (equipment: any) => Promise<boolean>;
  updateNewsletterSubscription: (subscribed: boolean) => Promise<boolean>;
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
        onAddEquipment={handleAddEquipment}
        equipmentTypes={equipmentTypes}
      />
      
      <ProfileEditEquipmentDialog
        open={showEditEquipmentDialog}
        onOpenChange={setShowEditEquipmentDialog}
        equipment={selectedEquipment}
        equipmentTypes={equipmentTypes}
        onSave={() => {}} // Adding the required prop
      />
      
      <ProfileEditMediaDialog
        open={showEditMediaDialog}
        onOpenChange={setShowEditMediaDialog}
      />
    </>
  );
};

export default ProfileDialogs;
