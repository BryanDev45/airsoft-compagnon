
import { useCallback } from 'react';

export const useTeamDataProcessor = () => {
  const formatTeamData = useCallback((
    teamData: any,
    formattedMembers: any[],
    upcomingGames: any[],
    pastGames: any[]
  ) => {
    const teamDataFormatted = {
      ...teamData,
      contactEmail: teamData.contact, 
      leader_id: teamData.leader_id,
      is_recruiting: teamData.is_recruiting,
      members: formattedMembers,
      upcomingGames,
      pastGames,
      field: teamData.team_fields?.[0] || null,
      stats: {
        gamesPlayed: pastGames.length + upcomingGames.length,
        memberCount: formattedMembers.length,
        averageRating: teamData.rating?.toFixed(1) || '0.0'
      }
    };

    console.log('Final formatted team data:', teamDataFormatted);
    return teamDataFormatted;
  }, []);

  return { formatTeamData };
};
