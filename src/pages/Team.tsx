
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TeamBanner from '../components/team/TeamBanner';
import TeamAbout from '../components/team/TeamAbout';
import TeamContent from '../components/team/TeamContent';
import TeamDialogs from '../components/team/TeamDialogs';
import { useTeamData } from '@/hooks/useTeamData';
import { useTeamView } from '@/hooks/team/useTeamView';

const Team = () => {
  const { id } = useParams();
  
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

  // Function to handle team updates
  const handleTeamUpdate = () => {
    fetchTeamData();
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

            <TeamContent
              team={team}
              isTeamMember={isTeamMember}
              handleViewMember={handleViewMember}
              isEditingField={isEditingField}
              setIsEditingField={setIsEditingField}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              fetchTeamData={fetchTeamData}
              handleFieldEdit={handleFieldEdit}
            />
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
