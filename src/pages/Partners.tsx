
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePartners } from '@/hooks/usePartners';
import PartnerDialog from '@/components/partners/PartnerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Partners = () => {
  const { partners, loading, isAdmin, addPartner, updatePartner, deletePartner } = usePartners();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-airsoft-red rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement des partenaires...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">Nos Partenaires</h1>
              {isAdmin && (
                <PartnerDialog onSave={addPartner} />
              )}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les partenaires qui nous font confiance et contribuent à faire grandir la communauté Airsoft Compagnon.
            </p>
          </div>

          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun partenaire pour le moment.</p>
              {isAdmin && (
                <div className="mt-4">
                  <PartnerDialog onSave={addPartner} />
                </div>
              )}
            </div>
          ) : (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.map((partner) => (
                  <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2 flex justify-center items-center h-40 bg-gray-100">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="max-h-32 max-w-[80%] object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="text-4xl mb-2">🏢</div>
                          <p className="text-sm">Logo non disponible</p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="mb-2 flex justify-between items-center">
                        <CardTitle className="text-xl">{partner.name}</CardTitle>
                        <span className="bg-airsoft-red text-xs text-white px-2 py-1 rounded-full">{partner.category}</span>
                      </div>
                      <CardDescription className="min-h-[60px]">{partner.description || 'Aucune description disponible.'}</CardDescription>
                      {isAdmin && (
                        <div className="flex gap-2 mt-4">
                          <PartnerDialog 
                            partner={partner} 
                            onSave={(data) => updatePartner(partner.id, data)}
                            trigger={
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le partenaire</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer "{partner.name}" ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deletePartner(partner.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {partner.website ? (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                            Visiter le site <ExternalLink size={16} className="ml-2" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Site non disponible
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Vous souhaitez devenir partenaire ?</h2>
            <p className="text-center mb-8">
              Rejoignez notre réseau de partenaires et bénéficiez d'une visibilité auprès de notre communauté passionnée d'airsoft.
            </p>
            <div className="flex justify-center">
              <Button className="bg-airsoft-red hover:bg-red-700" asChild>
                <a href="/contact">Nous contacter</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
