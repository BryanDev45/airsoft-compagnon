
import React, { useState } from 'react';
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
import { useTeamData } from '@/hooks/useTeamData';

const Team = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    team, 
    loading, 
    error, 
    isTeamMember, 
    currentUserId, 
    fetchTeamData 
  } = useTeamData(id);
  
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [isEditingField, setIsEditingField] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);

  // Function to handle team updates
  const handleTeamUpdate = (updatedTeam: any) => {
    fetchTeamData();
  };

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
              <CardDescription>{error.message}</CardDescription>
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
