
import { useState } from 'react';

export const useGameDialogs = () => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  return {
    showShareDialog,
    setShowShareDialog,
    showRegistrationDialog,
    setShowRegistrationDialog
  };
};
