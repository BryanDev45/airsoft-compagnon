
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useSocialAuth } from './useSocialAuth';
import { useAuthEventHandler } from './state/useAuthEventHandler';
import { useAuthInitializer } from './state/useAuthInitializer';
import { useSessionManager } from './state/useSessionManager';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  initialLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  register: (email: string, password: string, userData: any) => Promise<any>;
  logout: () => Promise<void>;
  handleSocialLogin: (provider: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    session,
    initialLoading,
    setUser,
    setSession,
    setInitialLoading,
    initializeFromCache,
    getInitialSession,
    clearAuthState,
    loadProfile
  } = useSessionManager();

  const { loading: actionsLoading, login, register, logout } = useAuthActions();
  const { loading: socialLoading, handleSocialAuth } = useSocialAuth();

  // Set up auth event handler
  useAuthEventHandler({ loadProfile, clearAuthState });

  // Initialize auth state
  useAuthInitializer({
    initialLoading,
    setInitialLoading,
    initializeFromCache,
    getInitialSession,
    loadProfile
  });

  const loading = actionsLoading || socialLoading;

  const enhancedUser = user ? {
    ...user,
    team_id: user.team_id || null,
  } : null;

  const contextValue: AuthContextType = {
    user: enhancedUser,
    session,
    loading,
    initialLoading,
    login,
    register,
    logout,
    handleSocialLogin: handleSocialAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
