
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for team search results
const mockTeams = [
  {
    id: "1",
    name: "Les Rapaces",
    logo: "/placeholder.svg",
    region: "Île-de-France",
    memberCount: 15,
    description: "Équipe d'airsoft basée à Paris, spécialisée dans les parties CQB et urbaines",
    isAssociation: true
  },
  {
    id: "2",
    name: "Ghost Team",
    logo: "/placeholder.svg",
    region: "Auvergne-Rhône-Alpes",
    memberCount: 20,
    description: "Équipe MilSim professionnelle avec focus sur les opérations tactiques",
    isAssociation: false
  },
  {
    id: "3",
    name: "Strike Force",
    logo: "/placeholder.svg",
    region: "PACA",
    memberCount: 12,
    description: "Équipe amicale et inclusive, tous niveaux bienvenus",
    isAssociation: true
  }
];

interface TeamSearchResultsProps {
  searchQuery: string;
}

const TeamSearchResults = ({ searchQuery }: TeamSearchResultsProps) => {
  // Filter teams based on search query
  const filteredTeams = mockTeams.filter(team => 
    searchQuery.length === 0 || 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filteredTeams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune équipe trouvée</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredTeams.map(team => (
        <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link to={`/team/${team.id}`} className="flex-shrink-0">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={team.logo} 
                  alt={team.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Link to={`/team/${team.id}`} className="font-semibold hover:text-airsoft-red transition-colors">
                  {team.name}
                </Link>
                {team.isAssociation && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Association
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{team.description}</p>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {team.region}
                </div>
                
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {team.memberCount} membres
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-3 sm:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Mail size={14} />
                Contacter
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamSearchResults;
