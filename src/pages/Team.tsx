
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamBanner from '../components/team/TeamBanner';
import TeamAbout from '../components/team/TeamAbout';
import TeamDialogs from '../components/team/TeamDialogs';
import { useTeamData } from '@/hooks/useTeamData';
import { useTeamView } from '@/hooks/team/useTeamView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamMembers from '../components/team/TeamMembers';
import TeamGames from '../components/team/TeamGames';
import TeamField from '../components/team/TeamField';
import TeamRating from '../components/team/TeamRating';
import TeamNews from '../components/team/TeamNews';

const Team = () => {
  const {
    id
  } = useParams();
  const {
    team,
    loading,
    error,
    isTeamMember,
    currentUserId,
    fetchTeamData
  } = useTeamData(id);
  const {
    selectedMember,
    setSelectedMember,
    showMemberDialog,
    setShowMemberDialog,
    showContactDialog,
    setShowContactDialog,
    showShareDialog,
    setShowShareDialog,
    contactMessage,
    setContactMessage,
    contactSubject,
    setContactSubject,
    isEditingField,
    setIsEditingField,
    selectedField,
    setSelectedField,
    handleViewMember,
    handleContactTeam,
    handleSendMessage,
    handleShare,
    handleShareVia,
    handleFieldEdit
  } = useTeamView(team, fetchTeamData);
  const [activeTab, setActiveTab] = useState('members');

  const currentUserMember = team?.members?.find((m: any) => m.id === currentUserId);
  const isTeamAdmin = team?.leader_id === currentUserId || currentUserMember?.role === 'Admin';

  // Function to handle team updates
  const handleTeamUpdate = () => {
    fetchTeamData();
  };
  if (loading && !team) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>;
  }
  if (error) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Erreur</CardTitle>
              <CardDescription>{error.message}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button onClick={() => fetchTeamData()} className="bg-airsoft-red hover:bg-red-700">
                Réessayer
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>;
  }
  if (!team) {
    return <div className="min-h-screen flex flex-col">
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
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <TeamBanner team={team} isTeamMember={isTeamMember} onTeamUpdate={handleTeamUpdate} />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3 space-y-6">
              <TeamAbout team={team} handleContactTeam={handleContactTeam} handleShare={handleShare} isTeamMember={isTeamMember} currentUserId={currentUserId} onTeamUpdate={handleTeamUpdate} />
            </div>

            <div className="md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="members">Membres ({team.members?.length || 0})</TabsTrigger>
                  <TabsTrigger value="news">Actualités</TabsTrigger>
                  <TabsTrigger value="games">Parties</TabsTrigger>
                  <TabsTrigger value="field">Terrain</TabsTrigger>
                  
                </TabsList>
                <TabsContent value="members" className="mt-4">
                  <TeamMembers members={team.members || []} handleViewMember={handleViewMember} isAssociation={team.is_association} />
                </TabsContent>
                <TabsContent value="news" className="mt-4">
                  <TeamNews teamId={team.id} isTeamAdmin={isTeamAdmin} />
                </TabsContent>
                <TabsContent value="games" className="mt-4">
                  <TeamGames upcomingGames={team.upcomingGames || []} pastGames={team.pastGames || []} />
                </TabsContent>
                <TabsContent value="field" className="mt-4">
                  <TeamField 
                    field={team.field} 
                    isEditing={isEditingField} 
                    isTeamAdmin={isTeamAdmin}
                    onEdit={(_fieldId, _updates) => {
                      if (isTeamAdmin) setIsEditingField(true);
                    }} 
                    onSave={async (fieldId, updates) => {
                      if (isTeamAdmin) {
                        await handleFieldEdit(fieldId, updates);
                        setIsEditingField(false);
                      }
                    }} 
                    onCancel={() => {
                      if (isTeamAdmin) setIsEditingField(false);
                    }} 
                  />
                </TabsContent>
                <TabsContent value="ratings" className="mt-4">
                  <TeamRating teamId={team.id} teamName={team.name} currentUserId={currentUserId} isTeamMember={isTeamMember} currentRating={team.stats?.averageRating ? parseFloat(team.stats.averageRating) : 0} onRatingUpdate={fetchTeamData} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <TeamDialogs team={team} selectedMember={selectedMember} showMemberDialog={showMemberDialog} setShowMemberDialog={setShowMemberDialog} showContactDialog={showContactDialog} setShowContactDialog={setShowContactDialog} showShareDialog={showShareDialog} setShowShareDialog={setShowShareDialog} contactMessage={contactMessage} setContactMessage={setContactMessage} contactSubject={contactSubject} setContactSubject={setContactSubject} handleSendMessage={handleSendMessage} handleShareVia={handleShareVia} />
    </div>;
};
export default Team;
