
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, Users, MapPin, Gamepad2 } from 'lucide-react';

interface ResponsiveChartsContainerProps {
  gamesPerMonth: any[];
  registrationsPerMonth: any[];
  playersByCountry: any[];
  gamesByCountry: any[];
}

const ResponsiveChartsContainer: React.FC<ResponsiveChartsContainerProps> = ({
  gamesPerMonth,
  registrationsPerMonth,
  playersByCountry,
  gamesByCountry
}) => {
  const chartConfig = {
    games: { label: "Parties", color: "#dc2626" },
    registrations: { label: "Inscriptions", color: "#16a34a" },
    players: { label: "Joueurs", color: "#2563eb" },
    countries: { label: "Pays", color: "#7c3aed" }
  };

  const COLORS = ['#dc2626', '#16a34a', '#2563eb', '#7c3aed', '#ea580c', '#0891b2', '#be123c', '#059669'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Parties par mois */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <span className="truncate">Parties créées par mois</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gamesPerMonth} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-games)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Inscriptions par mois */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="truncate">Inscriptions par mois</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationsPerMonth} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-registrations)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Joueurs par pays */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="truncate">Répartition des joueurs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={playersByCountry}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
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

      {/* Parties par pays */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="truncate">Parties par pays</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gamesByCountry}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {gamesByCountry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveChartsContainer;
