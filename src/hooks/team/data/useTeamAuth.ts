
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTeamAuth = () => {
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  const checkUserMembership = useCallback(async (formattedMembers: any[]) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting current user:', userError);
    }
    
    const currentUserId = userData?.user?.id;
    console.log('Current user ID:', currentUserId);
    setCurrentUserId(currentUserId);
    
    const isCurrentUserMember = currentUserId ? 
      formattedMembers.some(member => member.id === currentUserId) : 
      false;
      
    console.log('Is current user member:', isCurrentUserMember);
    setIsTeamMember(isCurrentUserMember);

    return { currentUserId, isCurrentUserMember };
  }, []);

  return {
    isTeamMember,
    currentUserId,
    checkUserMembership,
    setIsTeamMember,
    setCurrentUserId
  };
};
