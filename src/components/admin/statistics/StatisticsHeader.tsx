
import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatisticsHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
        <TrendingUp className="h-6 w-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistiques de la plateforme</h2>
        <p className="text-gray-600">Vue d'ensemble des métriques de la communauté</p>
      </div>
    </div>
  );
};

export default StatisticsHeader;
