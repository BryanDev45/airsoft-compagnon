
import { useState, useCallback, useEffect } from 'react';
import { useTeamFetch } from './team/data/useTeamFetch';
import { useTeamMembers } from './team/data/useTeamMembers';
import { useTeamGames } from './team/data/useTeamGames';
import { useTeamAuth } from './team/data/useTeamAuth';
import { useTeamDataProcessor } from './team/data/useTeamDataProcessor';

export const useTeamData = (teamId: string | undefined) => {
  const [team, setTeam] = useState<any>(null);
  
  const { fetchTeamById, loading, error } = useTeamFetch();
  const { fetchTeamMembers } = useTeamMembers();
  const { fetchTeamGames } = useTeamGames();
  const { isTeamMember, currentUserId, checkUserMembership } = useTeamAuth();
  const { formatTeamData } = useTeamDataProcessor();

  // Function to fetch team data
  const fetchTeamData = useCallback(async () => {
    if (!teamId) {
      console.error('No teamId provided to fetchTeamData');
      return;
    }
    
    try {
      // Fetch team basic data
      const teamData = await fetchTeamById(teamId);
      if (!teamData) return null;

      // Fetch team members
      const { formattedMembers, memberUserIds } = await fetchTeamMembers(teamId);

      // Update team leader information
      const updatedMembers = formattedMembers.map(member => ({
        ...member,
        isTeamLeader: member.id === teamData.leader_id
      }));

      // Fetch team games
      const { upcomingGames, pastGames } = await fetchTeamGames(memberUserIds);

      // Check user membership
      await checkUserMembership(updatedMembers);

      // Format final team data
      const finalTeamData = formatTeamData(teamData, updatedMembers, upcomingGames, pastGames);
      
      setTeam(finalTeamData);
      return finalTeamData;
    } catch (error) {
      console.error('Error in fetchTeamData:', error);
      throw error;
    }
  }, [teamId, fetchTeamById, fetchTeamMembers, fetchTeamGames, checkUserMembership, formatTeamData]);

  useEffect(() => {
    console.log('useEffect triggered with teamId:', teamId);
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId, fetchTeamData]);

  return {
    team,
    loading,
    error,
    isTeamMember,
    currentUserId,
    fetchTeamData,
  };
};
