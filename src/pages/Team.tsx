
import React, { useEffect, useState } from 'react';
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

const Team = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [isEditingField, setIsEditingField] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select(`
            *,
            team_members (
              id,
              role,
              user_id,
              profiles:user_id (
                id,
                username,
                avatar,
                join_date,
                is_verified
              )
            ),
            team_fields (*)
          `)
          .eq('id', id)
          .single();

        if (teamError) throw teamError;

        if (!teamData) {
          toast({
            title: "Équipe non trouvée",
            description: "Cette équipe n'existe pas ou a été supprimée",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Get team games
        const { data: gamesData, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .eq('organizer_id', teamData.id)
          .order('date', { ascending: true });

        if (gamesError) throw gamesError;

        // Format team members data
        const formattedMembers = teamData.team_members.map(member => ({
          id: member.profiles?.id,
          username: member.profiles?.username,
          role: member.role,
          avatar: member.profiles?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + member.profiles?.username,
          joinedTeam: member.profiles?.join_date ? new Date(member.profiles.join_date).toLocaleDateString('fr-FR') : 'N/A',
          verified: member.profiles?.is_verified
        })).filter(member => member.id); // Filter out any members without valid profile data

        // Split games into upcoming and past
        const now = new Date();
        const upcomingGames = (gamesData || [])
          .filter(game => new Date(game.date) > now)
          .map(game => ({
            id: game.id,
            title: game.title,
            date: new Date(game.date).toLocaleDateString('fr-FR'),
            location: game.location,
            participants: game.participants || 0
          }));

        const pastGames = (gamesData || [])
          .filter(game => new Date(game.date) <= now)
          .map(game => ({
            id: game.id,
            title: game.title,
            date: new Date(game.date).toLocaleDateString('fr-FR'),
            location: game.location,
            result: game.status,
            participants: game.participants || 0
          }));

        setTeam({
          ...teamData,
          members: formattedMembers,
          upcomingGames,
          pastGames,
          field: teamData.team_fields?.[0] || null,
          stats: {
            gamesPlayed: (gamesData || []).length,
            memberCount: formattedMembers.length,
            averageRating: teamData.rating?.toFixed(1) || '0.0'
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'équipe",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (id) {
      fetchTeamData();
    }
  }, [id, navigate]);

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
      description: `Votre message a été envoyé à ${team.name} (${team.contactEmail})`
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
        <TeamBanner team={team} />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3 space-y-6">
              <TeamAbout 
                team={team} 
                handleContactTeam={handleContactTeam} 
                handleShare={handleShare} 
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
                    field={selectedField}
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
