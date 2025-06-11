
import React from 'react';
import { Calendar } from 'lucide-react';
import { formatGameDate } from '@/utils/dateUtils';

interface GameDateDisplayProps {
  date: string;
  endDate?: string;
}

const GameDateDisplay: React.FC<GameDateDisplayProps> = ({ date, endDate }) => {
  const formattedDate = formatGameDate(date, endDate);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Calendar className="h-4 w-4" />
      <span>{formattedDate}</span>
    </div>
  );
};

export default GameDateDisplay;
