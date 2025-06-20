
import React from 'react';
import ResponsiveChartsContainer from './ResponsiveChartsContainer';

interface StatsChartsSectionProps {
  gamesPerMonth: any[];
  registrationsPerMonth: any[];
  playersByCountry: any[];
  gamesByCountry: any[];
}

const StatsChartsSection: React.FC<StatsChartsSectionProps> = (props) => {
  return <ResponsiveChartsContainer {...props} />;
};

export default StatsChartsSection;
