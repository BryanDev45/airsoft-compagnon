
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
    
    // Force une mise à jour immédiate des données
    if (id) {
      // Invalider et refetch immédiatement
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['gameParticipants', id]
        }),
        queryClient.invalidateQueries({
          queryKey: ['gameData', id]
        }),
        queryClient.refetchQueries({
          queryKey: ['gameParticipants', id]
        }),
        queryClient.refetchQueries({
          queryKey: ['gameData', id]
        })
      ]);
      
      // Forcer le rechargement des participants avec la fonction callback
      await loadParticipants();
    }
    
    if (result?.showDialog) {
      setShowRegistrationDialog(true);
    }
  };

  const handleUnregister = async () => {
    await handleUnregisterBase();
    
    // Force une mise à jour immédiate des données
    if (id) {
      // Invalider et refetch immédiatement
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['gameParticipants', id]
        }),
        queryClient.invalidateQueries({
          queryKey: ['gameData', id]
        }),
        queryClient.refetchQueries({
          queryKey: ['gameParticipants', id]
        }),
        queryClient.refetchQueries({
          queryKey: ['gameData', id]
        })
      ]);
      
      // Forcer le rechargement des participants avec la fonction callback
      await loadParticipants();
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
