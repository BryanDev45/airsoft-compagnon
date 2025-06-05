
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DesktopAuthSection } from './auth/DesktopAuthSection';
import { MobileAuthSection } from './auth/MobileAuthSection';
import LoginButton from './auth/LoginButton';

interface AuthSectionProps {
  isDesktop?: boolean;
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  isDesktop = true,
  notificationCount,
  handleSheetOpenChange
}) => {
  const { user, logout, initialLoading } = useAuth();

  // Fetch notifications for the user
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // If loading, show a basic login button to ensure users can always access login
  if (initialLoading) {
    return <LoginButton />;
  }
  
  // If not authenticated, show login button
  if (!user) {
    return <LoginButton />;
  }
  
  // If authenticated, show user menu and notifications
  if (isDesktop) {
    return (
      <DesktopAuthSection
        user={user}
        logout={logout}
        notifications={notifications}
        notificationCount={notificationCount}
        handleSheetOpenChange={handleSheetOpenChange}
      />
    );
  } else {
    return (
      <MobileAuthSection
        user={user}
        logout={logout}
        notifications={notifications}
        notificationCount={notificationCount}
        handleSheetOpenChange={handleSheetOpenChange}
      />
    );
  }
};
