
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import StoresMapSection from '../components/stores/StoresMapSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Store, MapPin, User, Users, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserSearchResults from '../components/search/UserSearchResults';
import TeamSearchResults from '../components/search/TeamSearchResults';
import { useAuth } from '../hooks/useAuth';
import AddStoreDialog from '../components/stores/AddStoreDialog';
import { supabase } from '@/integrations/supabase/client';

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return <div className="min-h-screen flex flex-col">
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
              <TabsList className="mb-8">
                <TabsTrigger value="parties" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Parties
                </TabsTrigger>
                <TabsTrigger value="joueurs" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Joueurs
                </TabsTrigger>
                <TabsTrigger value="equipes" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Équipes
                </TabsTrigger>
                <TabsTrigger value="magasins" className="flex items-center gap-1">
                  <Store className="h-4 w-4" />
                  Magasins
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="parties">
                <MapSection />
              </TabsContent>
              
              <TabsContent value="joueurs">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center border rounded-md overflow-hidden mb-6">
                      <Input placeholder="Rechercher un joueur par nom, localisation..." className="border-0 focus-visible:ring-0 flex-1" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      <Button variant="ghost" className="rounded-l-none">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <UserSearchResults searchQuery={searchQuery} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="equipes">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md">
                        <Input placeholder="Rechercher une équipe par nom, région..." className="border-0 focus-visible:ring-0 flex-1" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Button variant="ghost" className="rounded-l-none">
                          <Search className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {!user?.team_id && !initialLoading && <Button onClick={handleCreateTeam} className="bg-airsoft-red hover:bg-red-700 text-white ml-4">
                          <Plus className="h-4 w-4 mr-2" /> Créer une équipe
                        </Button>}
                    </div>
                    
                    <TeamSearchResults searchQuery={searchQuery} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="magasins">
                <div className="mb-6 flex justify-end">
                  {isAdmin && (
                    <Button onClick={() => setIsAddStoreDialogOpen(true)} className="bg-airsoft-red hover:bg-red-700 text-white">
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
    </div>;
};

export default Recherche;
