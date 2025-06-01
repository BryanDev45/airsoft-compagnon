
import { useGameRegistration } from './useGameRegistration';
import { useGameDeletion } from './useGameDeletion';
import { useGameDialogs } from './useGameDialogs';

export const useGameActions = (gameData: any, id: string | undefined, loadParticipants: () => void) => {
  const {
    loadingRegistration,
    handleRegistration: handleRegistrationBase,
    handleUnregister
  } = useGameRegistration(gameData, id, loadParticipants);

  const {
    deletingGame,
    handleDeleteGame,
    isUserAdmin
  } = useGameDeletion(gameData, id);

  const {
    showShareDialog,
    setShowShareDialog,
    showRegistrationDialog,
    setShowRegistrationDialog
  } = useGameDialogs();

  const handleRegistration = async (isRegistered: boolean) => {
    const result = await handleRegistrationBase(isRegistered);
    if (result?.showDialog) {
      setShowRegistrationDialog(true);
    }
  };

  return {
    loadingRegistration,
    showShareDialog,
    setShowShareDialog,
    showRegistrationDialog,
    setShowRegistrationDialog,
    deletingGame,
    handleRegistration,
    handleUnregister,
    handleDeleteGame,
    isUserAdmin
  };
};
