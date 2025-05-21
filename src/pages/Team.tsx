import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

import TeamBanner from '../components/team/TeamBanner';
import TeamAbout from '../components/team/TeamAbout';
import TeamMembers from '../components/team/TeamMembers';
import TeamGames from '../components/team/TeamGames';
import TeamField from '../components/team/TeamField';
import TeamDialogs from '../components/team/TeamDialogs';

// Define a shared TeamMember interface that is consistent with TeamMembers.tsx
interface TeamMember {
  id: string;
  username?: string;
  role?: string;
  avatar?: string;
  joinedTeam?: string;
  verified?: boolean;
  specialty?: string;
  isTeamLeader?: boolean;
  status?: string; // Ajout du statut pour filtrer les membres
}

interface TeamData {
  id: string;
  name: string;
  description?: string;
  location?: string;
  logo?: string;
  banner?: string;
  contact?: string;
  contactEmail?: string;
  is_recruiting?: boolean;
  leader_id?: string;
  members: TeamMember[];
  upcomingGames: any[];
  pastGames: any[];
  field: any;
  stats: {
    gamesPlayed: number;
    memberCount: number;
    averageRating: string;
  };
}

const Team = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [isEditingField, setIsEditingField] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Function to fetch team data that can be reused for refresh
  const fetchTeamData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoading(false);
        setError("Chargement des données de l'équipe a pris trop de temps. Veuillez réessayer.");
      }, 15000); // 15 seconds timeout
      
      setLoadingTimeout(timeout);
      
      // Fetch team data with separate queries to avoid relationship issues
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*, team_fields(*)')
        .eq('id', id)
        .single();

      if (teamError) {
        clearTimeout(timeout);
        throw teamError;
      }

      if (!teamData) {
        clearTimeout(timeout);
        toast({
          title: "Équipe non trouvée",
          description: "Cette équipe n'existe pas ou a été supprimée",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Get team members
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('id, role, user_id, status')
        .eq('team_id', teamData.id)
        .eq('status', 'confirmed');

      if (membersError) {
        clearTimeout(timeout);
        throw membersError;
      }

      // Get profiles for team members
      let formattedMembers: TeamMember[] = [];
      let memberUserIds: string[] = [];
      
      if (teamMembers && teamMembers.length > 0) {
        const userIds = teamMembers.map(member => member.user_id).filter(Boolean);
        memberUserIds = [...userIds];
        
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar, join_date, is_verified')
            .in('id', userIds);

          if (profilesError) {
            clearTimeout(timeout);
            throw profilesError;
          }

          // Match profiles with team members and format the data
          formattedMembers = teamMembers.map(member => {
            const profile = profiles?.find(p => p.id === member.user_id);
            if (!profile) return null;
            
            // Generate avatar URL based on username if avatar doesn't exist
            let avatarUrl = profile.avatar;
            if (!avatarUrl || !avatarUrl.startsWith('http')) {
              avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username || 'default'}`;
            }
            
            return {
              id: profile.id,
              username: profile.username,
              role: member.role,
              avatar: avatarUrl,
              joinedTeam: profile.join_date ? new Date(profile.join_date).toLocaleDateString('fr-FR') : 'N/A',
              verified: profile.is_verified,
              specialty: 'Non spécifié', // Default value, update if you have specialty data
              isTeamLeader: member.user_id === teamData.leader_id, // Mark the team leader
              status: member.status // Include the status for filtering
            };
          }).filter(Boolean) as TeamMember[];
        }
      }

      // Prepare empty arrays for games in case of no games
      let upcomingGames: any[] = [];
      let pastGames: any[] = [];

      // Get games created by team members - only if there are member IDs
      if (memberUserIds.length > 0) {
        try {
          // Get games with a try-catch to prevent failure if this part errors
          const { data: teamGames, error: gamesError } = await supabase
            .from('airsoft_games')
            .select('*')
            .in('created_by', memberUserIds)
            .order('date', { ascending: true });
  
          if (!gamesError && teamGames) {
            // Fetch creator usernames in a separate query
            const creatorIds = teamGames.map(game => game.created_by).filter(Boolean);
            const { data: creatorProfiles } = await supabase
              .from('profiles')
              .select('id, username')
              .in('id', creatorIds);
            
            // Attach creator info to games
            const gamesData = teamGames.map(game => {
              const creator = creatorProfiles?.find(profile => profile.id === game.created_by);
              return {
                ...game,
                creator: creator ? { username: creator.username } : null
              };
            });
  
            // Split games into upcoming and past
            const now = new Date();
            upcomingGames = (gamesData || [])
              .filter(game => new Date(game.date) > now)
              .map(game => ({
                id: game.id,
                title: game.title,
                date: new Date(game.date).toLocaleDateString('fr-FR'),
                location: game.city,
                participants: game.max_players || 0,
                creator: game.creator
              }));
  
            pastGames = (gamesData || [])
              .filter(game => new Date(game.date) <= now)
              .map(game => ({
                id: game.id,
                title: game.title,
                date: new Date(game.date).toLocaleDateString('fr-FR'),
                location: game.city,
                result: "Terminé", // Default status since game.status may not exist
                participants: game.max_players || 0,
                creator: game.creator
              }));
          }
        } catch (gameError) {
          console.error("Erreur lors de la récupération des parties:", gameError);
          // Don't fail the whole team loading just because games failed
        }
      }

      // Check if the current user is a member of this team
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;
      setCurrentUserId(currentUserId);
      
      const isCurrentUserMember = currentUserId ? 
        formattedMembers.some(member => member.id === currentUserId) : 
        false;
        
      setIsTeamMember(isCurrentUserMember);

      const teamDataFormatted: TeamData = {
        ...teamData,
        contactEmail: teamData.contact, // Map contact email
        leader_id: teamData.leader_id, // Include team leader ID
        is_recruiting: teamData.is_recruiting, // Include recruitment status
        members: formattedMembers,
        upcomingGames,
        pastGames,
        field: teamData.team_fields?.[0] || null,
        stats: {
          gamesPlayed: pastGames.length + upcomingGames.length,
          memberCount: formattedMembers.length,
          averageRating: teamData.rating?.toFixed(1) || '0.0'
        }
      };

      // Clear timeout as we've successfully loaded
      clearTimeout(timeout);
      setTeam(teamDataFormatted);
      setLoading(false);
      // Reset retry count on success
      setRetryCount(0);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des données:", error);
      
      if (loadingTimeout) clearTimeout(loadingTimeout);
      
      // Check if it's a network error and we haven't retried too many times
      if ((error.message && error.message.includes("Failed to fetch") || 
           error.message && error.message.includes("upstream connect error")) && 
          retryCount < 3) {
        setRetryCount(prev => prev + 1);
        
        // Retry after a delay (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        
        toast({
          title: "Problème de connexion",
          description: `Nouvelle tentative de connexion dans ${delay/1000} secondes...`,
        });
        
        setTimeout(() => {
          fetchTeamData();
        }, delay);
      } else {
        // If it's not a connection error or we've retried too many times
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'équipe: " + error.message,
          variant: "destructive",
        });
        
        setError("Une erreur s'est produite lors du chargement des données de l'équipe. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    }
  }, [id, navigate, loadingTimeout, retryCount]);

  useEffect(() => {
    if (id) {
      fetchTeamData();
    }
    
    return () => {
      // Clean up timeout on unmount
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [id, fetchTeamData]);

  // Function to handle team updates
  const handleTeamUpdate = useCallback((updatedTeam: Partial<TeamData>) => {
    if (team) {
      // Update team data in state with the updated fields
      setTeam(prevTeam => {
        if (!prevTeam) return null;
        return {
          ...prevTeam,
          ...updatedTeam
        };
      });
      
      // Show success message
      toast({
        title: "Mise à jour réussie",
        description: "Les informations de l'équipe ont été mises à jour.",
      });
    }
  }, [team]);

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberDialog(true);
  };

  const handleContactTeam = () => {
    setShowContactDialog(true);
  };

  const handleSendMessage = () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message envoyé",
      description: `Votre message a été envoyé à ${team?.name} (${team?.contactEmail})`
    });
    setContactMessage('');
    setContactSubject('');
    setShowContactDialog(false);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleShareVia = (method: string) => {
    const shareUrl = window.location.href;
    const shareText = `Découvrez l'équipe ${team?.name} sur Airsoft Compagnon!`;

    switch (method) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Lien copié",
            description: "Le lien a été copié dans votre presse-papier"
          });
        });
        break;
    }

    setShowShareDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Erreur</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button 
                onClick={() => fetchTeamData()}
                className="bg-airsoft-red hover:bg-red-700"
              >
                Réessayer
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Équipe non trouvée</CardTitle>
              <CardDescription>L'équipe que vous recherchez n'existe pas ou a été supprimée.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <TeamBanner 
          team={team} 
          isTeamMember={isTeamMember}
          onTeamUpdate={handleTeamUpdate}
        />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3 space-y-6">
              <TeamAbout 
                team={team} 
                handleContactTeam={handleContactTeam} 
                handleShare={handleShare} 
                isTeamMember={isTeamMember}
              />
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="members">
                <TabsList className="mb-6">
                  <TabsTrigger value="members">Membres</TabsTrigger>
                  <TabsTrigger value="games">Parties</TabsTrigger>
                  <TabsTrigger value="field">Terrain</TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                  <TeamMembers members={team.members} handleViewMember={handleViewMember} />
                </TabsContent>

                <TabsContent value="games">
                  <TeamGames upcomingGames={team.upcomingGames} pastGames={team.pastGames} />
                </TabsContent>

                <TabsContent value="field">
                  <TeamField 
                    field={team.field}
                    isEditing={isEditingField}
                    onEdit={(fieldId, updates) => {
                      setSelectedField(updates);
                      setIsEditingField(true);
                    }}
                    onSave={async (fieldId, updates) => {
                      if (fieldId) {
                        const { error } = await supabase
                          .from('team_fields')
                          .update(updates)
                          .eq('id', fieldId);
                        
                        if (error) {
                          console.error('Error updating field:', error);
                          return;
                        }
                      } else {
                        const { error } = await supabase
                          .from('team_fields')
                          .insert([{ ...updates, team_id: team?.id }]);
                        
                        if (error) {
                          console.error('Error creating field:', error);
                          return;
                        }
                      }
                      
                      // Refresh the team data
                      fetchTeamData();
                      setIsEditingField(false);
                    }}
                    onCancel={() => {
                      setIsEditingField(false);
                      setSelectedField(null);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <TeamDialogs 
        team={team}
        selectedMember={selectedMember}
        showMemberDialog={showMemberDialog}
        setShowMemberDialog={setShowMemberDialog}
        showContactDialog={showContactDialog}
        setShowContactDialog={setShowContactDialog}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        contactMessage={contactMessage}
        setContactMessage={setContactMessage}
        contactSubject={contactSubject}
        setContactSubject={setContactSubject}
        handleSendMessage={handleSendMessage}
        handleShareVia={handleShareVia}
      />
    </div>
  );
};

export default Team;
