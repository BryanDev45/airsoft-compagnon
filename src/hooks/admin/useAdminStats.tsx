
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
    discordBotDownloads: externalStats.discordBotDownloads,
    discordBotInvites: externalStats.discordBotInvites,
    pwaInstalls: externalStats.pwaInstalls,
    homePageVisits: externalStats.pageStats?.find(p => p.page_path === '/')?.visit_count || 0,
    partiesPageVisits: externalStats.pageStats?.find(p => p.page_path === '/parties')?.visit_count || 0,
    toolboxPageVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox')?.visit_count || 0,
    profilePageVisits: externalStats.pageStats?.find(p => p.page_path === '/profile')?.visit_count || 0,
    teamPageVisits: externalStats.pageStats?.find(p => p.page_path === '/team')?.visit_count || 0,
    toolboxCalculatorsVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox/calculators')?.visit_count || 0,
    toolboxDiscordBotVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox/discord-bot')?.visit_count || 0,
    toolboxGlossaryVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox/glossary')?.visit_count || 0,
    toolboxScenariosVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox/scenarios')?.visit_count || 0,
    toolboxTroubleshootingVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox/troubleshooting')?.visit_count || 0,
    toolboxGuidesVisits: externalStats.pageStats?.find(p => p.page_path === '/toolbox/guides')?.visit_count || 0,
    partiesTabVisits: externalStats.pageStats?.find(p => p.page_path === '/parties/parties')?.visit_count || 0,
    joueursTabVisits: externalStats.pageStats?.find(p => p.page_path === '/parties/joueurs')?.visit_count || 0,
    equipesTabVisits: externalStats.pageStats?.find(p => p.page_path === '/parties/equipes')?.visit_count || 0,
    magasinsTabVisits: externalStats.pageStats?.find(p => p.page_path === '/parties/magasins')?.visit_count || 0,
  };

  return { data, isLoading: false, error: null };
};
