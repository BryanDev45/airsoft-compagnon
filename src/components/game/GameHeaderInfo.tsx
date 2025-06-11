
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { formatGameDateRange, formatGameTimeRange } from '@/utils/dateUtils';

interface GameHeaderInfoProps {
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  address: string;
  zipCode: string;
  city: string;
  participantsCount: number;
  maxPlayers: number;
}

const GameHeaderInfo: React.FC<GameHeaderInfoProps> = ({
  date,
  endDate,
  startTime,
  endTime,
  address,
  zipCode,
  city,
  participantsCount,
  maxPlayers
}) => {
  const formattedDateRange = formatGameDateRange(date, startTime, endTime, endDate);
  const formattedTimeRange = formatGameTimeRange(startTime, endTime);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-200 mt-2">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-airsoft-red" />
        <span>{formattedDateRange}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-airsoft-red" />
        <span>{formattedTimeRange}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-airsoft-red" />
        <span className="truncate">{address}, {zipCode} {city}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users size={16} className="text-airsoft-red" />
        <span>
          <span className="font-medium">{participantsCount}</span>
          <span className="text-gray-300">/{maxPlayers}</span> participants
        </span>
      </div>
    </div>
  );
};

export default GameHeaderInfo;
