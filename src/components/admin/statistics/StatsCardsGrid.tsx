
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UsersRound, 
  Calendar, 
  CalendarCheck, 
  CalendarClock,
  Wifi,
  MessageSquare,
  MessageCircle,
  ShieldCheck,
  UserX,
  Bot,
  Download,
  Smartphone,
} from 'lucide-react';

interface StatsCardsGridProps {
  stats: any;
}

const StatsCardsGrid: React.FC<StatsCardsGridProps> = ({ stats }) => {
  const statisticsCards = [
    {
      title: 'Utilisateurs inscrits',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Utilisateurs vérifiés',
      value: stats?.verifiedUsers || 0,
      icon: ShieldCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Utilisateurs bannis',
      value: stats?.bannedUsers || 0,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Utilisateurs en ligne',
      value: stats?.onlineUsers || 0,
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Équipes créées',
      value: stats?.totalTeams || 0,
      icon: UsersRound,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Parties créées',
      value: stats?.totalGames || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Parties passées',
      value: stats?.pastGames || 0,
      icon: CalendarCheck,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Parties à venir',
      value: stats?.upcomingGames || 0,
      icon: CalendarClock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Messages envoyés',
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Conversations actives',
      value: stats?.totalConversations || 0,
      icon: MessageCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Bot Discord téléchargé',
      value: stats?.discordBotDownloads || 0,
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Bot Discord invité',
      value: stats?.discordBotInvites || 0,
      icon: Bot,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Installations PWA',
      value: stats?.pwaInstalls || 0,
      icon: Smartphone,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {statisticsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mis à jour en temps réel
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCardsGrid;
