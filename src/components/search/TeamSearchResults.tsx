
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Mail, UserPlus, Star, Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamSearchResultsProps {
  searchQuery: string;
}

interface Team {
  id: string;
  name: string;
  logo?: string;
  region?: string;
  memberCount?: number;
  description?: string;
  isAssociation?: boolean;
  rating?: number;
  location?: string;
  member_count?: number;
  is_association?: boolean;
  is_recruiting?: boolean;
}

const TeamSearchResults = ({
  searchQuery
}: TeamSearchResultsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams from Supabase
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('teams')
          .select('*');
        
        // Add search filter if query exists
        if (searchQuery && searchQuery.trim().length > 0) {
          query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Map the database results to our UI model
        const formattedTeams = data.map(team => ({
          id: team.id,
          name: team.name,
          logo: team.logo || "/placeholder.svg",
          region: team.location,
          memberCount: team.member_count || 0,
          description: team.description || '',
          isAssociation: team.is_association || false,
          rating: team.rating || 0,
          location: team.location,
          is_recruiting: team.is_recruiting
        }));
        
        setTeams(formattedTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Impossible de charger les équipes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, [searchQuery]);
  
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

  const handleContactTeam = (teamId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour contacter une équipe",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    const team = teams.find(t => t.id === teamId);
    toast({
      title: "Contact",
      description: `Envoi d'un message à l'équipe ${team?.name}`,
    });
    
    // Dans une implémentation réelle, rediriger vers la messagerie
    navigate('/messages');
  };

  const handleApplyToTeam = (teamId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour postuler à une équipe",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Find the team to apply to
    const team = teams.find(t => t.id === teamId);
    
    // Create team membership request
    const createMembershipRequest = async () => {
      try {
        const { error } = await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: user.id,
            role: 'Membre',
            status: 'pending'
          });
          
        if (error) throw error;
        
        toast({
          title: "Candidature envoyée",
          description: `Votre candidature a été envoyée à l'équipe ${team?.name}`,
        });
      } catch (err) {
        console.error("Error sending team application:", err);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer votre candidature. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    };
    
    createMembershipRequest();
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
      stars.push(<span key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <Star className="absolute top-0 left-0 h-4 w-4 text-yellow-400 overflow-hidden" style={{
          clipPath: 'inset(0 50% 0 0)'
        }} />
        </span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
        <span className="ml-2">Chargement des équipes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{teams.length} équipes trouvées</h3>
      </div>
      
      {teams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune équipe trouvée</p>
          <Button onClick={handleCreateTeam} className="bg-airsoft-red hover:bg-red-700 mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Créer votre équipe maintenant
          </Button>
        </div>
      ) : (
        teams.map(team => (
          <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigateToTeam(team.id)}>
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold hover:text-airsoft-red transition-colors cursor-pointer" onClick={() => handleNavigateToTeam(team.id)}>
                    {team.name}
                  </span>
                  {team.isAssociation && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Association
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center mb-2">
                  {renderRatingStars(team.rating || 0)}
                  <span className="ml-2 text-sm text-gray-600">{(team.rating || 0).toFixed(1)}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{team.description}</p>
                
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                  {team.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {team.location}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {team.memberCount} membres
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleContactTeam(team.id)}
                >
                  <Mail size={14} />
                  Contacter
                </Button>
                {/* Afficher le bouton Postuler uniquement si l'équipe recrute */}
                {team.is_recruiting !== false && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleApplyToTeam(team.id)}
                  >
                    <UserPlus size={14} />
                    Postuler
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamSearchResults;
