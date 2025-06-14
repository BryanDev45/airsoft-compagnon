
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useRegisterContainer = () => {
  const { loading: authLoading } = useAuth();
  const [socialLoading, setSocialLoading] = useState(false);

  const isAnyLoading = authLoading || socialLoading;

  return {
    isAnyLoading
  };
};
