import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ShareIcon, MapPin, Phone, CalendarIcon, Users, UserPlus, Info } from 'lucide-react';
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
    };
  };
  handleContactTeam: () => void;
  handleShare: () => void;
  isTeamMember?: boolean;
}
const TeamAbout = ({
  team,
  handleContactTeam,
  handleShare,
  isTeamMember
}: TeamAboutProps) => {
  const [isJoining, setIsJoining] = useState(false);
  const {
    user
  } = useAuth();
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
      const {
        data: profileData,
        error: profileError
      } = await supabase.from('profiles').select('team_id').eq('id', user.id).single();
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
      const {
        data: existingRequest,
        error: requestError
      } = await supabase.from('team_members').select('*').eq('team_id', team.id).eq('user_id', user.id);
      if (requestError) throw requestError;
      if (existingRequest && existingRequest.length > 0) {
        toast({
          title: "Demande existante",
          description: "Vous avez déjà fait une demande pour rejoindre cette équipe"
        });
        return;
      }

      // Créer la demande avec le statut "pending"
      const {
        data,
        error
      } = await supabase.from('team_members').insert([{
        team_id: team.id,
        user_id: user.id,
        status: 'pending',
        role: 'Membre'
      }]);
      if (error) throw error;

      // Créer une notification pour le leader de l'équipe
      await supabase.from('notifications').insert([{
        user_id: team.leader_id,
        title: 'Nouvelle demande d\'adhésion',
        message: `Un joueur souhaite rejoindre votre équipe ${team.name}`,
        type: 'team_request',
        link: `/team/${team.id}`,
        related_id: team.id
      }]);
      toast({
        title: "Demande envoyée",
        description: "Votre demande pour rejoindre cette équipe a été envoyée, vous serez notifié quand elle sera acceptée"
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

  // Vérifier si l'utilisateur fait déjà partie d'une équipe
  const shouldShowJoinButton = team.is_recruiting && !isTeamMember && user && !user?.team_id;
  return <Card className="overflow-hidden rounded-xl shadow-md border-gray-100 transition-all hover:shadow-lg">
      <CardContent className="p-6 relative">
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
              <Info className="h-5 w-5 mr-2 text-airsoft-red" /> À propos
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {team.is_recruiting && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium px-3 py-1">
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Recrutement ouvert
                </Badge>}
              
              {team.is_association && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1">
                  Association loi 1901
                </Badge>}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
              <p className="text-gray-700 leading-relaxed">
                {team.description || "Aucune description disponible"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Informations</h3>
              <div className="space-y-3">
                {team.location && <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 mr-2 text-airsoft-red" />
                    <span>{team.location}</span>
                  </div>}
                
                {team.contact && <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Mail className="h-4 w-4 mr-2 text-airsoft-red" />
                    <span>{team.contact}</span>
                  </div>}
                
                {team.founded && <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <CalendarIcon className="h-4 w-4 mr-2 text-airsoft-red" />
                    <span>Fondée en {team.founded}</span>
                  </div>}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Statistiques</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white shadow-sm p-3 text-center rounded-lg border border-gray-100">
                  <p className="font-semibold text-lg text-airsoft-red">{team.stats.memberCount}</p>
                  <p className="text-xs text-gray-500">Membres</p>
                </div>
                <div className="bg-white shadow-sm p-3 text-center rounded-lg border border-gray-100">
                  <p className="font-semibold text-lg text-airsoft-red">{team.stats.gamesPlayed}</p>
                  <p className="text-xs text-gray-500">Parties</p>
                </div>
                <div className="bg-white shadow-sm p-3 text-center rounded-lg border border-gray-100">
                  <p className="font-semibold text-lg text-airsoft-red">{team.stats.averageRating}</p>
                  <p className="text-xs text-gray-500">Note</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-gray-100">
            {shouldShowJoinButton && <Button className="w-full bg-airsoft-red hover:bg-red-700" onClick={handleJoinTeam} disabled={isJoining}>
                <UserPlus className="h-4 w-4 mr-2" />
                {isJoining ? "En cours..." : "Rejoindre l'équipe"}
              </Button>}
            
            <Button variant="outline" onClick={handleContactTeam} className="w-full bg-airsoft-red text-zinc-50">
              <Mail className="h-4 w-4 mr-2" />
              Contacter
            </Button>
            
            <Button variant="outline" onClick={handleShare} className="w-full bg-airsoft-red text-zinc-50">
              <ShareIcon className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default TeamAbout;