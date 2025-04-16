
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Flag, Trophy, Shield, Calendar, MapPin, Info, User, ArrowLeft, MessageSquare, Share } from 'lucide-react';

const Team = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  useEffect(() => {
    // Mock data fetch
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
          winRate: "68%",
          gamesPlayed: 42,
          memberCount: 5,
          averageRating: 4.8
        }
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberDialog(true);
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
        {/* Team Banner */}
        <div 
          className="h-64 bg-cover bg-center relative" 
          style={{ backgroundImage: `url(${team.banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
            <Link to="/" className="text-white hover:text-gray-200 transition-colors absolute top-6 left-6">
              <ArrowLeft className="mr-2" />
              <span className="sr-only">Retour</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={team.logo} 
                  alt={team.name} 
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                <p className="text-gray-200 italic">"{team.slogan}"</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-200">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {team.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Fondée en {team.founded}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {team.members.length} membres
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Team Details */}
            <div className="md:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>À propos de nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{team.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Victoires</p>
                      <p className="text-xl font-bold text-airsoft-red">{team.stats.winRate}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Parties</p>
                      <p className="text-xl font-bold text-airsoft-red">{team.stats.gamesPlayed}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Membres</p>
                      <p className="text-xl font-bold text-airsoft-red">{team.stats.memberCount}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Évaluation</p>
                      <p className="text-xl font-bold text-airsoft-red flex items-center justify-center">
                        {team.stats.averageRating}
                        <svg className="w-5 h-5 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      Contacter
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-airsoft-red text-white hover:bg-red-700">
                      <Share size={16} />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* La section Récompenses a été supprimée comme demandé */}
            </div>

            {/* Team Content */}
            <div className="md:w-2/3">
              <Tabs defaultValue="members">
                <TabsList className="mb-6">
                  <TabsTrigger value="members">Membres</TabsTrigger>
                  <TabsTrigger value="games">Parties</TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.members.map((member: any) => (
                      <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex items-start p-4">
                            <div className="relative">
                              <img 
                                src={member.avatar} 
                                alt={member.username} 
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              {member.isTeamLeader && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                  <img 
                                    src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png" 
                                    alt="Team Leader" 
                                    className="w-6 h-6"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex-grow">
                              <div className="flex items-center">
                                <h3 className="font-semibold">{member.username}</h3>
                                {member.verified && (
                                  <img 
                                    src="/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png" 
                                    alt="Vérifié" 
                                    className="w-5 h-5 ml-1"
                                  />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{member.role}</p>
                              <p className="text-xs text-gray-400 mt-1">Membre depuis {member.joinedTeam}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-airsoft-red border-airsoft-red hover:bg-airsoft-red hover:text-white"
                              onClick={() => handleViewMember(member)}
                            >
                              Profil
                            </Button>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 border-t">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Spécialité:</span> {member.specialty}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="games">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="text-airsoft-red" size={20} />
                        Parties à venir
                      </h3>
                      {team.upcomingGames.length > 0 ? (
                        <div className="space-y-4">
                          {team.upcomingGames.map((game: any) => (
                            <Card key={game.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold">{game.title}</h4>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Calendar size={14} /> {game.date}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin size={14} /> {game.location}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Users size={14} /> {game.participants} participants
                                      </span>
                                    </div>
                                  </div>
                                  <Button 
                                    className="bg-airsoft-red hover:bg-red-700 text-white"
                                  >
                                    Voir détails
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                          Aucune partie à venir
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Flag className="text-airsoft-red" size={20} />
                        Parties passées
                      </h3>
                      {team.pastGames.length > 0 ? (
                        <div className="space-y-4">
                          {team.pastGames.map((game: any) => (
                            <Card key={game.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold">{game.title}</h4>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Calendar size={14} /> {game.date}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin size={14} /> {game.location}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Trophy size={14} className="text-yellow-500" /> {game.result}
                                      </span>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="outline"
                                    className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                                  >
                                    Voir détails
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                          Aucune partie passée
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Member Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedMember?.username}
              {selectedMember?.verified && (
                <img 
                  src="/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png" 
                  alt="Vérifié" 
                  className="w-5 h-5 ml-1"
                />
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={selectedMember?.avatar} 
                alt={selectedMember?.username} 
                className="w-20 h-20 rounded-full object-cover"
              />
              {selectedMember?.isTeamLeader && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <img 
                    src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png" 
                    alt="Team Leader" 
                    className="w-6 h-6"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{selectedMember?.username}</h3>
              <p className="text-sm text-gray-500">{selectedMember?.role}</p>
              <p className="text-xs text-gray-400">Membre depuis {selectedMember?.joinedTeam}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Spécialité</h4>
              <p className="text-sm">{selectedMember?.specialty}</p>
            </div>
            {selectedMember?.isTeamLeader && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Shield className="text-yellow-600" size={16} />
                  <p className="text-sm font-medium text-yellow-800">Chef d'équipe</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Ce joueur est le fondateur et leader de l'équipe
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowMemberDialog(false)}
            >
              Fermer
            </Button>
            <Button 
              className="bg-airsoft-red hover:bg-red-700"
              asChild
            >
              <Link to={`/profile`}>Voir profil complet</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
