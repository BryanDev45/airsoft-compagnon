
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    department: string;
    type: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 clip-card">
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png" alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <div className="flex items-center gap-2 text-white">
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        <div className="mt-2">
          <Badge variant="outline" className="mr-2">
            {event.type === 'cqb' ? 'CQB' : 
             event.type === 'milsim' ? 'Milsim' : 
             event.type === 'woodland' ? 'Woodland' : 
             event.type === 'speedsoft' ? 'Speedsoft' : 
             event.type === 'tournament' ? 'Tournoi' : 
             event.type}
          </Badge>
          <Badge variant="outline">
            Dép. {event.department}
          </Badge>
        </div>
        <Link to={`/game/${event.id}`}>
          <Button className="w-full mt-4 bg-airsoft-red hover:bg-red-700">
            Plus d'informations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
