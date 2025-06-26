
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import StoresMapSection from '../components/stores/StoresMapSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Store, MapPin, User, Users, Search, Plus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserSearchResults from '../components/search/UserSearchResults';
import TeamSearchResults from '../components/search/TeamSearchResults';
import { useAuth } from '../hooks/useAuth';
import AddStoreDialog from '../components/stores/AddStoreDialog';
import { supabase } from '@/integrations/supabase/client';
import { useTabAnalytics } from '../hooks/usePageAnalytics';
import UserSearchInput from '../components/search/UserSearchInput';
import TeamSearchInput from '../components/search/TeamSearchInput';
import { useDebouncedUserSearch } from '../hooks/search/useDebouncedUserSearch';
import { useDebouncedTeamSearch } from '../hooks/search/useDebouncedTeamSearch';

// This component will automatically scroll to top on mount
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const Recherche = () => {
  const navigate = useNavigate();
  const {
    user,
    initialLoading
  } = useAuth();
  const [activeTab, setActiveTab] = useState("parties");
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Separate search states for each tab
  const { 
    inputValue: userSearchQuery, 
    setInputValue: setUserSearchQuery, 
    users, 
    isLoading: isLoadingUsers 
  } = useDebouncedUserSearch();
  
  const { 
    inputValue: teamSearchQuery, 
    setInputValue: setTeamSearchQuery, 
    teams, 
    isLoading: isLoadingTeams 
  } = useDebouncedTeamSearch();

  // Tracker les visites des onglets de recherche
  useTabAnalytics(activeTab, '/parties');

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profileData?.Admin === true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const handleCreateParty = () => {
    if (user) {
      navigate('/parties/create');
    } else {
      navigate('/login');
    }
  };

  const handleCreateTeam = () => {
    if (user) {
      navigate('/team/create');
    } else {
      navigate('/login');
    }
  };

  // Stable callback functions to prevent re-renders
  const handleUserSearchChange = useCallback((query: string) => {
    setUserSearchQuery(query);
  }, [setUserSearchQuery]);

  const handleTeamSearchChange = useCallback((query: string) => {
    setTeamSearchQuery(query);
  }, [setTeamSearchQuery]);

  // Composant pour les onglets nécessitant une connexion
  const AuthRequiredContent = ({ children, tabName }: { children: React.ReactNode, tabName: string }) => {
    if (!user) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connexion requise
              </h3>
              <p className="text-gray-500 mb-6">
                Vous devez être connecté pour accéder à la recherche de {tabName}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/login')} className="bg-airsoft-red hover:bg-red-700">
                  Se connecter
                </Button>
                <Button onClick={() => navigate('/register')} variant="outline">
                  S'inscrire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-2">
                <Search className="h-8 w-8 text-airsoft-red" />
                <h1 className="text-4xl font-bold">Recherche</h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Trouvez des parties, des joueurs, des équipes et des magasins
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="overflow-x-auto pb-2">
                <TabsList className="mb-8">
                  <TabsTrigger value="parties" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Parties
                  </TabsTrigger>
                  <TabsTrigger value="joueurs" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Joueurs
                    {!user && <Lock className="h-3 w-3 ml-1" />}
                  </TabsTrigger>
                  <TabsTrigger value="equipes" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Équipes
                    {!user && <Lock className="h-3 w-3 ml-1" />}
                  </TabsTrigger>
                  <TabsTrigger value="magasins" className="flex items-center gap-1">
                    <Store className="h-4 w-4" />
                    Magasins
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="parties">
                <MapSection />
              </TabsContent>
              
              <TabsContent value="joueurs">
                <AuthRequiredContent tabName="joueurs">
                  <Card>
                    <CardContent className="pt-6">
                      <UserSearchInput 
                        searchQuery={userSearchQuery}
                        onSearchChange={handleUserSearchChange}
                      />
                      
                      <UserSearchResults 
                        users={users}
                        isLoading={isLoadingUsers}
                        searchQuery={userSearchQuery}
                      />
                    </CardContent>
                  </Card>
                </AuthRequiredContent>
              </TabsContent>
              
              <TabsContent value="equipes">
                <AuthRequiredContent tabName="équipes">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <TeamSearchInput 
                          searchQuery={teamSearchQuery}
                          onSearchChange={handleTeamSearchChange}
                        />
                        
                        {!user?.team_id && !initialLoading && (
                          <Button onClick={handleCreateTeam} className="bg-airsoft-red hover:bg-red-700 text-white w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" /> Créer une équipe
                          </Button>
                        )}
                      </div>
                      
                      <TeamSearchResults 
                        teams={teams}
                        isLoading={isLoadingTeams}
                        searchQuery={teamSearchQuery}
                      />
                    </CardContent>
                  </Card>
                </AuthRequiredContent>
              </TabsContent>
              
              <TabsContent value="magasins">
                <div className="mb-6 flex flex-col sm:flex-row sm:justify-end">
                  {isAdmin && (
                    <Button onClick={() => setIsAddStoreDialogOpen(true)} className="bg-airsoft-red hover:bg-red-700 text-white w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" /> Ajouter un magasin
                    </Button>
                  )}
                </div>
                <StoresMapSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Dialog d'ajout de magasin */}
      <AddStoreDialog 
        open={isAddStoreDialogOpen} 
        onOpenChange={setIsAddStoreDialogOpen} 
      />
    </div>
  );
};

export default Recherche;
