
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import types
import { 
  GeneralInfoSectionProps,
  LocationSectionProps,
  PowerLimitsSectionProps,
  ProtectionSectionProps,
  ConsumablesSectionProps,
  SettingsSectionProps,
  ImageUploadSectionProps
} from '@/types/party';

// Formulaire de création/édition de partie
import GeneralInfoSection from '@/components/party/GeneralInfoSection';
import LocationSection from '@/components/party/LocationSection';
import PowerLimitsSection from '@/components/party/PowerLimitsSection';
import ProtectionSection from '@/components/party/ProtectionSection';
import ConsumablesSection from '@/components/party/ConsumablesSection';
import SettingsSection from '@/components/party/SettingsSection';
import ImageUploadSection from '@/components/party/ImageUploadSection';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // État pour les données du formulaire
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Vérifier si l'utilisateur est connecté et est l'organisateur
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        toast({
          variant: "destructive", 
          title: "Accès refusé",
          description: "Vous devez être connecté pour modifier une partie"
        });
        navigate('/login');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('airsoft_games')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Vérifier si l'utilisateur est l'organisateur
        if (data.created_by !== user.id) {
          toast({
            variant: "destructive", 
            title: "Accès refusé",
            description: "Vous n'êtes pas l'organisateur de cette partie"
          });
          navigate('/parties');
          return;
        }
        
        // Charger les données de la partie
        setFormData(data);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Erreur lors du chargement des données :", error);
        toast({
          variant: "destructive", 
          title: "Erreur",
          description: "Impossible de charger les détails de la partie"
        });
        navigate('/parties');
      }
    };
    
    checkAuth();
  }, [user, id, navigate, toast]);

  // Fonction pour mettre à jour les données du formulaire
  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Fonction pour enregistrer les modifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive", 
        title: "Erreur",
        description: "Vous devez être connecté pour modifier une partie"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Mise à jour dans la base de données
      const { error } = await supabase
        .from('airsoft_games')
        .update(formData)
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "La partie a été mise à jour avec succès"
      });
      
      // Redirection vers la page de détails
      navigate(`/game/${id}`);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde :", error);
      toast({
        variant: "destructive", 
        title: "Erreur",
        description: "Impossible de mettre à jour la partie"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Chargement des détails de la partie...</p>
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Modifier la partie</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <GeneralInfoSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <LocationSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <PowerLimitsSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <ProtectionSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <ConsumablesSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <SettingsSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <ImageUploadSection
              updateFormData={updateFormData}
              initialData={formData}
            />
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate(`/game/${id}`)}
                className="px-4 py-2 mr-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-airsoft-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <div className="mr-2 h-4 w-4 border-2 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
                    Enregistrement...
                  </span>
                ) : (
                  "Enregistrer les modifications"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditGame;
