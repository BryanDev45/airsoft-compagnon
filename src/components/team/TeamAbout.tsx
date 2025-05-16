
// Mettre à jour le composant TeamAbout pour changer le statut d'une demande d'adhésion à "pending"
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ShareIcon, MapPin, Phone, CalendarIcon, Users, UserPlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface TeamAboutProps {
  team: {
    name: string;
    description?: string;
    location?: string;
    contact?: string;
    founded?: string;
    is_recruiting?: boolean;
    is_association?: boolean;
    id: string;
    leader_id?: string;
    stats: {
      memberCount: number;
      gamesPlayed: number;
      averageRating: string;
    }
  };
  handleContactTeam: () => void;
  handleShare: () => void;
}

const TeamAbout = ({ team, handleContactTeam, handleShare }: TeamAboutProps) => {
  const [isJoining, setIsJoining] = useState(false);
  const { user } = useAuth();

  const handleJoinTeam = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour rejoindre une équipe",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsJoining(true);
      
      // Vérifier si l'utilisateur est déjà membre d'une équipe
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData?.team_id) {
        toast({
          title: "Déjà membre d'une équipe",
          description: "Vous devez d'abord quitter votre équipe actuelle avant d'en rejoindre une autre",
          variant: "destructive"
        });
        return;
      }
      
      // Vérifier si une demande existe déjà
      const { data: existingRequest, error: requestError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .eq('user_id', user.id);
        
      if (requestError) throw requestError;
      
      if (existingRequest && existingRequest.length > 0) {
        toast({
          title: "Demande existante",
          description: "Vous avez déjà fait une demande pour rejoindre cette équipe",
        });
        return;
      }
      
      // Créer la demande avec le statut "pending"
      const { data, error } = await supabase
        .from('team_members')
        .insert([
          { 
            team_id: team.id, 
            user_id: user.id,
            status: 'pending',
            role: 'Membre'
          }
        ]);
        
      if (error) throw error;
      
      // Créer une notification pour le leader de l'équipe
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: team.leader_id,
            title: 'Nouvelle demande d\'adhésion',
            message: `Un joueur souhaite rejoindre votre équipe ${team.name}`,
            type: 'team_request',
            link: `/team/${team.id}`,
            related_id: team.id
          }
        ]);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande pour rejoindre cette équipe a été envoyée, vous serez notifié quand elle sera acceptée",
      });
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h2 className="font-bold text-xl mb-4">À propos</h2>
          
          {team.is_recruiting && (
            <div className="mb-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <UserPlus className="h-3 w-3 mr-1" /> Recrutement ouvert
              </Badge>
            </div>
          )}
          
          {team.is_association && (
            <div className="mb-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Association loi 1901
              </Badge>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {team.description || "Aucune description disponible"}
          </p>
          
          <div className="space-y-3">
            {team.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-airsoft-red" />
                <span>{team.location}</span>
              </div>
            )}
            
            {team.contact && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-airsoft-red" />
                <span>{team.contact}</span>
              </div>
            )}
            
            {team.founded && (
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2 text-airsoft-red" />
                <span>Fondée en {team.founded}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-airsoft-red" />
              <span>{team.stats.memberCount} membres</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-3 text-center rounded-lg">
              <p className="text-sm text-gray-600">Membres</p>
              <p className="font-bold text-lg">{team.stats.memberCount}</p>
            </div>
            <div className="bg-gray-50 p-3 text-center rounded-lg">
              <p className="text-sm text-gray-600">Parties</p>
              <p className="font-bold text-lg">{team.stats.gamesPlayed}</p>
            </div>
            <div className="bg-gray-50 p-3 text-center rounded-lg">
              <p className="text-sm text-gray-600">Note</p>
              <p className="font-bold text-lg">{team.stats.averageRating}</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            {team.is_recruiting && (
              <Button 
                className="w-full bg-airsoft-red hover:bg-red-700"
                onClick={handleJoinTeam}
                disabled={isJoining}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isJoining ? "En cours..." : "Rejoindre l'équipe"}
              </Button>
            )}
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleContactTeam}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contacter
            </Button>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleShare}
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TeamAbout;
