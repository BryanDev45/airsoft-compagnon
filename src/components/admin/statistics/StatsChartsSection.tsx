
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, UserPlus, Globe, MapPin } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatsChartsSectionProps {
  gamesPerMonth: Array<{ month: string; count: number }>;
  registrationsPerMonth: Array<{ month: string; count: number }>;
  playersByCountry: Array<{ country: string; count: number }>;
  gamesByCountry: Array<{ country: string; count: number }>;
}

const StatsChartsSection: React.FC<StatsChartsSectionProps> = ({
  gamesPerMonth,
  registrationsPerMonth,
  playersByCountry,
  gamesByCountry
}) => {
  const chartConfig = {
    count: {
      label: "Nombre",
      color: "#2563eb",
    },
  };

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
    '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
  ];

  return (
    <>
      {/* Graphiques en barres - Stack vertical sur mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span className="truncate">Parties créées par mois</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gamesPerMonth} margin={{ top: 5, right: 5, left: 5, bottom: 30 }}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#6b7280' }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    width={30}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="#ea580c" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="truncate">Inscriptions par mois</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrationsPerMonth} margin={{ top: 5, right: 5, left: 5, bottom: 30 }}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#6b7280' }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    width={30}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="#2563eb" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques circulaires et par pays - Stack vertical sur mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="truncate">Joueurs par pays</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={playersByCountry}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ country, count, percent }) => {
                      // Afficher les labels seulement sur desktop
                      if (window.innerWidth < 640) return '';
                      return `${country}: ${count} (${(percent * 100).toFixed(1)}%)`;
                    }}
                    outerRadius={window.innerWidth < 640 ? 60 : 80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {playersByCountry.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <span className="truncate">Parties par pays</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gamesByCountry} margin={{ top: 5, right: 5, left: 5, bottom: 30 }}>
                  <XAxis 
                    dataKey="country" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#6b7280' }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    width={30}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="#dc2626" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StatsChartsSection;
