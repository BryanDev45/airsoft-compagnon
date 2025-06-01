
import { useGameRegistration } from './useGameRegistration';
import { useGameDeletion } from './useGameDeletion';
import { useGameDialogs } from './useGameDialogs';
import { useQueryClient } from '@tanstack/react-query';

export const useGameActions = (gameData: any, id: string | undefined, loadParticipants: () => void) => {
  const queryClient = useQueryClient();
  
  const {
    loadingRegistration,
    handleRegistration: handleRegistrationBase,
    handleUnregister: handleUnregisterBase
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
    
    // Invalider le cache pour forcer la mise à jour des données
    if (id) {
      await queryClient.invalidateQueries({
        queryKey: ['gameParticipants', id]
      });
      await queryClient.invalidateQueries({
        queryKey: ['gameData', id]
      });
    }
    
    if (result?.showDialog) {
      setShowRegistrationDialog(true);
    }
  };

  const handleUnregister = async () => {
    await handleUnregisterBase();
    
    // Invalider le cache pour forcer la mise à jour des données
    if (id) {
      await queryClient.invalidateQueries({
        queryKey: ['gameParticipants', id]
      });
      await queryClient.invalidateQueries({
        queryKey: ['gameData', id]
      });
    }
    
    // Fermer la boîte de dialogue après désinscription
    setShowRegistrationDialog(false);
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
