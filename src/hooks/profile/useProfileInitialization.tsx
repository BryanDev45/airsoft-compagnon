
import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';

export const useProfileInitialization = () => {
  const { user, initialLoading } = useAuth();
  const [canFetchData, setCanFetchData] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!initialLoading && user?.id) {
      setCanFetchData(true);
    }
  }, [initialLoading, user]);

  return {
    user,
    canFetchData,
    hasError,
    setHasError,
    initialLoading
  };
};
