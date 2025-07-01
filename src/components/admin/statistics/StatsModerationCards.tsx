import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle,
  Shield,
  MessageSquare,
  Flag,
  CheckCircle,
  Clock,
  AlertCircle,
  UserX
} from 'lucide-react';

interface StatsModerationCardsProps {
  stats: any;
}

const StatsModerationCards: React.FC<StatsModerationCardsProps> = ({ stats }) => {
  const moderationCards = [
    {
      title: 'Signalements d\'utilisateurs',
      value: stats?.totalUserReports || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Signalements en attente',
      value: stats?.pendingUserReports || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Signalements résolus',
      value: stats?.resolvedUserReports || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Signalements de messages',
      value: stats?.totalMessageReports || 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Messages signalés en attente',
      value: stats?.pendingMessageReports || 0,
      icon: Flag,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Messages signalés résolus',
      value: stats?.resolvedMessageReports || 0,
      icon: Shield,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Avertissements totaux',
      value: stats?.totalWarnings || 0,
      icon: AlertCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avertissements actifs',
      value: stats?.activeWarnings || 0,
      icon: UserX,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          <span className="truncate">Statistiques de modération</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {moderationCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`p-3 sm:p-4 rounded-lg ${stat.bgColor} text-center`}>
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
                <div className={`text-lg sm:text-2xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                  {stat.value.toLocaleString()}
                </div>
                <p className={`text-xs sm:text-sm font-medium ${stat.color} leading-tight`}>
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Moderation Insights */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Indicateurs de modération</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2 text-xs sm:text-sm">Taux de résolution</h5>
              <p className="text-lg sm:text-xl font-bold text-gray-600">
                {stats?.totalUserReports > 0 
                  ? Math.round((stats.resolvedUserReports / stats.totalUserReports) * 100) 
                  : 0}%
              </p>
              <p className="text-xs text-gray-500">Signalements utilisateurs</p>
            </div>
            
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2 text-xs sm:text-sm">Messages vs Utilisateurs</h5>
              <p className="text-lg sm:text-xl font-bold text-gray-600">
                {stats?.totalUserReports > 0 
                  ? Math.round((stats.totalMessageReports / stats.totalUserReports) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-500">Ratio messages/utilisateurs</p>
            </div>
            
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2 text-xs sm:text-sm">Charge de modération</h5>
              <p className="text-lg sm:text-xl font-bold text-gray-600">
                {(stats?.pendingUserReports || 0) + (stats?.pendingMessageReports || 0)}
              </p>
              <p className="text-xs text-gray-500">Signalements en attente</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsModerationCards;