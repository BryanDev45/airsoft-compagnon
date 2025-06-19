import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/admin/useAdminStats';
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
  TrendingUp,
  Bot,
  Download,
  Smartphone,
  Eye,
  BarChart3,
  UserPlus,
  Search
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatisticsTab: React.FC = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const chartConfig = {
    count: {
      label: "Nombre",
      color: "#2563eb",
    },
  };

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

  const pageVisitCards = [
    {
      title: 'Visites page d\'accueil',
      value: stats?.homePageVisits || 0,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Visites page parties',
      value: stats?.partiesPageVisits || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Visites page boîte à outils',
      value: stats?.toolboxPageVisits || 0,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Visites page profil',
      value: stats?.profilePageVisits || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Visites page équipe',
      value: stats?.teamPageVisits || 0,
      icon: Eye,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ];

  const searchTabVisitCards = [
    {
      title: 'Onglet Parties',
      value: stats?.partiesTabVisits || 0,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Onglet Joueurs',
      value: stats?.joueursTabVisits || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Onglet Équipes',
      value: stats?.equipesTabVisits || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Onglet Magasins',
      value: stats?.magasinsTabVisits || 0,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const toolboxVisitCards = [
    {
      title: 'Calculateurs',
      value: stats?.toolboxCalculatorsVisits || 0,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bot Discord',
      value: stats?.toolboxDiscordBotVisits || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Glossaire',
      value: stats?.toolboxGlossaryVisits || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Scénarios',
      value: stats?.toolboxScenariosVisits || 0,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Dépannage',
      value: stats?.toolboxTroubleshootingVisits || 0,
      icon: Eye,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Guides',
      value: stats?.toolboxGuidesVisits || 0,
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistiques de la plateforme</h2>
          <p className="text-gray-600">Vue d'ensemble des métriques de la communauté</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Games per Month Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Parties créées par mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.gamesPerMonth || []}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="#ea580c" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Registrations per Month Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Inscriptions par mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.registrationsPerMonth || []}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="#2563eb" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Grid */}
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

      {/* Page Visit Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Statistiques de visite des pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {pageVisitCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor} text-center`}>
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Page Tabs Visit Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Statistiques des onglets de la page de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchTabVisitCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor} text-center`}>
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Toolbox Visit Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-600" />
            Statistiques des onglets de la boîte à outils
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {toolboxVisitCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor} text-center`}>
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Informations complémentaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Taux de vérification</h4>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.totalUsers ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}%
              </p>
              <p className="text-sm text-blue-600">
                {stats?.verifiedUsers} sur {stats?.totalUsers} utilisateurs
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Parties actives</h4>
              <p className="text-2xl font-bold text-green-600">
                {stats?.totalGames ? Math.round((stats.upcomingGames / stats.totalGames) * 100) : 0}%
              </p>
              <p className="text-sm text-green-600">
                {stats?.upcomingGames} parties à venir sur {stats?.totalGames} total
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Adoption du bot Discord</h4>
              <p className="text-2xl font-bold text-purple-600">
                {((stats?.discordBotDownloads || 0) + (stats?.discordBotInvites || 0)).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">
                Total téléchargements + invitations
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              <strong>Note :</strong> Les statistiques sont actualisées automatiquement toutes les 30 secondes. 
              Les utilisateurs en ligne sont ceux ayant eu une activité dans les 5 dernières minutes.
              Les statistiques de téléchargement et de visite sont mises à jour en temps réel.
              Les graphiques montrent les données des 12 derniers mois.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTab;
