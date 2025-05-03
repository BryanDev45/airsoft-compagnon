
import { useState } from 'react';

export const useProfileDialogs = () => {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showEditMediaDialog, setShowEditMediaDialog] = useState(false);
  const [showEditBioDialog, setShowEditBioDialog] = useState(false);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);

  return {
    showSettingsDialog,
    setShowSettingsDialog,
    showEditMediaDialog,
    setShowEditMediaDialog,
    showEditBioDialog,
    setShowEditBioDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
    selectedGame,
    setSelectedGame,
    showGameDialog,
    setShowGameDialog,
    showAllGamesDialog,
    setShowAllGamesDialog,
    showBadgesDialog,
    setShowBadgesDialog
  };
};
