import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Mail, UserPlus, Star, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Mock data for team search results
const mockTeams = [
  {
    id: "1",
    name: "Les Rapaces",
    logo: "/placeholder.svg",
    region: "Île-de-France",
    memberCount: 15,
    description: "Équipe d'airsoft basée à Paris, spécialisée dans les parties CQB et urbaines",
    isAssociation: true,
    rating: 4.7
  },
  {
    id: "2",
    name: "Ghost Team",
    logo: "/placeholder.svg",
    region: "Auvergne-Rhône-Alpes",
    memberCount: 20,
    description: "Équipe MilSim professionnelle avec focus sur les opérations tactiques",
    isAssociation: false,
    rating: 4.3
  },
  {
    id: "3",
    name: "Strike Force",
    logo: "/placeholder.svg",
    region: "PACA",
    memberCount: 12,
    description: "Équipe amicale et inclusive, tous niveaux bienvenus",
    isAssociation: true,
    rating: 4.9
  }
];

interface TeamSearchResultsProps {
  searchQuery: string;
}

const TeamSearchResults = ({ searchQuery }: TeamSearchResultsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Filter teams based on search query
  const filteredTeams = mockTeams.filter(team => 
    searchQuery.length === 0 || 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleNavigateToTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleCreateTeam = () => {
    if (user) {
      navigate('/team/create');
    } else {
      navigate('/login');
    }
  };

  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <Star className="absolute top-0 left-0 h-4 w-4 text-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </span>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{filteredTeams.length} équipes trouvées</h3>
        <Button 
          onClick={handleCreateTeam}
          className="bg-airsoft-red hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer une équipe
        </Button>
      </div>
      
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune équipe trouvée</p>
          <Button 
            onClick={handleCreateTeam}
            className="bg-airsoft-red hover:bg-red-700 mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer votre équipe maintenant
          </Button>
        </div>
      ) : (
        filteredTeams.map(team => (
          <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div 
                className="flex-shrink-0 cursor-pointer" 
                onClick={() => handleNavigateToTeam(team.id)}
              >
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={team.logo} 
                    alt={team.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span 
                    className="font-semibold hover:text-airsoft-red transition-colors cursor-pointer"
                    onClick={() => handleNavigateToTeam(team.id)}
                  >
                    {team.name}
                  </span>
                  {team.isAssociation && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Association
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center mb-2">
                  {renderRatingStars(team.rating)}
                  <span className="ml-2 text-sm text-gray-600">{team.rating.toFixed(1)}</span>
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
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <UserPlus size={14} />
                  Postuler
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamSearchResults;
