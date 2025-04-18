import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    setTimeout(() => {
      setTeam({
        id: id || '1',
        name: "Les Invincibles",
        logo: "https://randomuser.me/api/portraits/men/44.jpg",
        banner: "/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png",
        description: "Équipe fondée en 2019 spécialisée en milsim et parties forestières. Nous organisons régulièrement des événements sur la région parisienne et participons aux grands événements nationaux.",
        slogan: "Ensemble, invincibles",
        location: "Paris, France",
        founded: "2019",
        organizationType: "association",
        contactEmail: "contact@lesinvincibles.fr",
        members: [
          {
            id: 1,
            username: "AirsoftMaster",
            role: "Chef d'équipe",
            avatar: "https://randomuser.me/api/portraits/men/44.jpg",
            joinedTeam: "Avril 2019",
            specialty: "Stratégie",
            verified: true,
            isTeamLeader: true
          },
          {
            id: 2,
            username: "SniperElite",
            role: "Tireur d'élite",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            joinedTeam: "Mai 2019",
            specialty: "Précision longue distance",
            verified: true,
            isTeamLeader: false
          },
          {
            id: 3,
            username: "MedicAngel",
            role: "Support médical",
            avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            joinedTeam: "Juin 2020",
            specialty: "Premiers secours",
            verified: false,
            isTeamLeader: false
          },
          {
            id: 4,
            username: "TacticalFox",
            role: "Éclaireur",
            avatar: "https://randomuser.me/api/portraits/men/28.jpg",
            joinedTeam: "Août 2021",
            specialty: "Reconnaissance",
            verified: true,
            isTeamLeader: false
          },
          {
            id: 5,
            username: "GunnerPrime",
            role: "Mitrailleur",
            avatar: "https://randomuser.me/api/portraits/men/36.jpg",
            joinedTeam: "Janvier 2022",
            specialty: "Support feu",
            verified: false,
            isTeamLeader: false
          }
        ],
        achievements: [
          { id: 1, title: "Champions de Paris Airsoft Challenge 2022", date: "Octobre 2022" },
          { id: 2, title: "2ème place au Tournoi National d'Airsoft 2023", date: "Mai 2023" },
          { id: 3, title: "Meilleur esprit d'équipe - Forest Warfare 2023", date: "Juillet 2023" }
        ],
        upcomingGames: [
          { 
            id: 1, 
            title: "Opération Blackout", 
            date: "15/05/2025", 
            location: "Terrain Battlezone, Paris",
            participants: 24
          },
          { 
            id: 2, 
            title: "CQB Summer Challenge", 
            date: "02/06/2025", 
            location: "Hangar 34, Marseille",
            participants: 36
          }
        ],
        pastGames: [
          { 
            id: 3, 
            title: "Milsim Weekend", 
            date: "10/03/2025", 
            location: "Forêt de Fontainebleau",
            result: "Victoire",
            participants: 80
          },
          { 
            id: 4, 
            title: "Urban Warfare", 
            date: "05/01/2025", 
            location: "Zone urbaine abandonnée, Lille",
            result: "2ème place",
            participants: 40
          }
        ],
        stats: {
          gamesPlayed: 42,
          memberCount: 5,
          averageRating: 4.8
        },
        field: {
          name: "Terrain Les Invincibles",
          description: "Terrain forestier de 10 hectares avec zones CQB et bunkers",
          address: "Forêt de Fontainebleau, 77300",
          coordinates: [2.6667, 48.4167],
          surface: "10 hectares",
          type: "Forestier avec structures CQB",
          hasBuildings: true,
          amenities: ["Zone de repos", "Parking", "Sanitaires", "Zone CQB"]
        }
      });
      setLoading(false);
    }, 800);
  }, [id]);

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
                          .insert([{ ...updates, team_id: teamId }]);
                        
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
