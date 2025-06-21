
import { useBasicStats } from './stats/useBasicStats';
import { useGameStats } from './stats/useGameStats';
import { useMessagingStats } from './stats/useMessagingStats';
import { useExternalStats } from './stats/useExternalStats';
import { useChartData } from './stats/useChartData';

interface AdminStats {
  totalUsers: number;
  totalTeams: number;
  totalGames: number;
  pastGames: number;
  upcomingGames: number;
  onlineUsers: number;
  totalMessages: number;
  totalConversations: number;
  verifiedUsers: number;
  bannedUsers: number;
  discordBotDownloads: number;
  discordBotInvites: number;
  pwaInstalls: number;
  homePageVisits: number;
  partiesPageVisits: number;
  toolboxPageVisits: number;
  profilePageVisits: number;
  teamPageVisits: number;
  toolboxCalculatorsVisits: number;
  toolboxDiscordBotVisits: number;
  toolboxGlossaryVisits: number;
  toolboxScenariosVisits: number;
  toolboxTroubleshootingVisits: number;
  toolboxGuidesVisits: number;
  partiesTabVisits: number;
  joueursTabVisits: number;
  equipesTabVisits: number;
  magasinsTabVisits: number;
  gamesPerMonth: Array<{ month: string; count: number }>;
  registrationsPerMonth: Array<{ month: string; count: number }>;
  playersByCountry: Array<{ country: string; count: number }>;
  gamesByCountry: Array<{ country: string; count: number }>;
}

export const useAdminStats = () => {
  const { data: basicStats, isLoading: basicLoading, error: basicError } = useBasicStats();
  const { data: gameStats, isLoading: gameLoading, error: gameError } = useGameStats();
  const { data: messagingStats, isLoading: messagingLoading, error: messagingError } = useMessagingStats();
  const { data: externalStats, isLoading: externalLoading, error: externalError } = useExternalStats();
  const { data: chartData, isLoading: chartLoading, error: chartError } = useChartData();

  const isLoading = basicLoading || gameLoading || messagingLoading || externalLoading || chartLoading;
  const error = basicError || gameError || messagingError || externalError || chartError;

  if (isLoading || error || !basicStats || !gameStats || !messagingStats || !externalStats || !chartData) {
    return { data: null, isLoading, error };
  }

  const data: AdminStats = {
    ...basicStats,
    ...gameStats,
    ...messagingStats,
    ...chartData,
    // Utiliser directement les propriétés de externalStats
    discordBotDownloads: externalStats.discordBotDownloads,
    discordBotInvites: externalStats.discordBotInvites,
    pwaInstalls: externalStats.pwaInstalls,
    homePageVisits: externalStats.homePageVisits,
    partiesPageVisits: externalStats.partiesPageVisits,
    toolboxPageVisits: externalStats.toolboxPageVisits,
    profilePageVisits: externalStats.profilePageVisits,
    teamPageVisits: externalStats.teamPageVisits,
    toolboxCalculatorsVisits: externalStats.toolboxCalculatorsVisits,
    toolboxDiscordBotVisits: externalStats.toolboxDiscordBotVisits,
    toolboxGlossaryVisits: externalStats.toolboxGlossaryVisits,
    toolboxScenariosVisits: externalStats.toolboxScenariosVisits,
    toolboxTroubleshootingVisits: externalStats.toolboxTroubleshootingVisits,
    toolboxGuidesVisits: externalStats.toolboxGuidesVisits,
    partiesTabVisits: externalStats.partiesTabVisits,
    joueursTabVisits: externalStats.joueursTabVisits,
    equipesTabVisits: externalStats.equipesTabVisits,
    magasinsTabVisits: externalStats.magasinsTabVisits,
  };

  return { data, isLoading: false, error: null };
};
