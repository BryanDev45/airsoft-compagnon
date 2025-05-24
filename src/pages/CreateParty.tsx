
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Copy } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { usePartyForm } from '@/hooks/usePartyForm';
import { useLastGame } from '@/hooks/useLastGame';
import { ScrollToTop } from "../components/ui/scroll-to-top";
import { toast } from "@/components/ui/use-toast";

// Import component sections
import GeneralInfoSection from '@/components/party/GeneralInfoSection';
import LocationSection from '@/components/party/LocationSection';
import PowerLimitsSection from '@/components/party/PowerLimitsSection';
import ProtectionSection from '@/components/party/ProtectionSection';
import ConsumablesSection from '@/components/party/ConsumablesSection';
import SettingsSection from '@/components/party/SettingsSection';
import ImageUploadSection from '@/components/party/ImageUploadSection';

const gameTypes = [{
  value: "dominicale",
  label: "Dominicale"
}, {
  value: "operation",
  label: "Opé"
}];

const CreateParty = () => {
  const navigate = useNavigate();
  
  const { 
    images, 
    preview, 
    handleImageChange, 
    removeImage 
  } = useImageUpload(5);
  
  const { form, isSubmitting, onSubmit } = usePartyForm(images);
  const { lastGame, isLoading } = useLastGame();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fonction pour préremplir le formulaire avec les données de la dernière partie
  const fillFromLastGame = () => {
    if (!lastGame) return;
    
    // Créer les dates avec les heures par défaut
    const startDateTime = new Date();
    startDateTime.setHours(parseInt(lastGame.start_time.split(':')[0]), parseInt(lastGame.start_time.split(':')[1]), 0, 0);
    
    const endDateTime = new Date();
    endDateTime.setHours(parseInt(lastGame.end_time.split(':')[0]), parseInt(lastGame.end_time.split(':')[1]), 0, 0);
    
    // Préremplir tous les champs du formulaire
    form.setValue('title', lastGame.title);
    form.setValue('description', lastGame.description);
    form.setValue('rules', lastGame.rules);
    form.setValue('startDateTime', startDateTime);
    form.setValue('endDateTime', endDateTime);
    form.setValue('address', lastGame.address);
    form.setValue('city', lastGame.city);
    form.setValue('zipCode', lastGame.zip_code);
    form.setValue('maxPlayers', lastGame.max_players.toString());
    form.setValue('price', lastGame.price.toString());
    form.setValue('gameType', lastGame.game_type);
    form.setValue('manualValidation', lastGame.manual_validation);
    form.setValue('hasToilets', lastGame.has_toilets);
    form.setValue('hasParking', lastGame.has_parking);
    form.setValue('hasEquipmentRental', lastGame.has_equipment_rental);
    form.setValue('aeg_fps_min', lastGame.aeg_fps_min.toString());
    form.setValue('aeg_fps_max', lastGame.aeg_fps_max.toString());
    form.setValue('dmr_fps_max', lastGame.dmr_fps_max.toString());
    form.setValue('eyeProtectionRequired', lastGame.eye_protection_required);
    form.setValue('fullFaceProtectionRequired', lastGame.full_face_protection_required);
    form.setValue('hpaAllowed', lastGame.hpa_allowed);
    form.setValue('polarStarAllowed', lastGame.polarstar_allowed);
    form.setValue('tracersAllowed', lastGame.tracers_allowed);
    form.setValue('grenadesAllowed', lastGame.grenades_allowed);
    form.setValue('smokesAllowed', lastGame.smokes_allowed);
    form.setValue('pyroAllowed', lastGame.pyro_allowed);
    form.setValue('isPrivate', lastGame.is_private);
    
    toast({
      title: "Informations préremplies",
      description: "Les informations de votre dernière partie ont été copiées dans le formulaire"
    });
  };
  
  // Fonction pour mettre à jour les données du formulaire (non utilisée ici mais nécessaire pour les props)
  const updateFormData = (section: string, data: any) => {
    // Cette fonction n'est pas utilisée dans CreateParty mais est requise par les interfaces
    console.log(`Updating section: ${section}`, data);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Créer une partie d'airsoft</h1>
                <p className="text-gray-600">Remplissez le formulaire ci-dessous pour organiser votre partie d'airsoft</p>
              </div>
              {lastGame && !isLoading && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={fillFromLastGame}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copier ma dernière partie
                </Button>
              )}
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* General Information Section */}
              <GeneralInfoSection gameTypes={gameTypes} updateFormData={updateFormData} />
              
              {/* Location Section */}
              <LocationSection updateFormData={updateFormData} />
              
              {/* Power Limits Section */}
              <PowerLimitsSection updateFormData={updateFormData} />
              
              {/* Protection Section */}
              <ProtectionSection updateFormData={updateFormData} />
              
              {/* Consumables Section */}
              <ConsumablesSection updateFormData={updateFormData} />
              
              {/* Settings Section */}
              <SettingsSection updateFormData={updateFormData} />
              
              {/* Image Upload Section */}
              <ImageUploadSection 
                images={images}
                preview={preview}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
              />
              
              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        J'accepte les conditions générales et je certifie que cette partie respecte les lois en vigueur
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-500 mt-1">
                        Le prix minimum est de 5€ par joueur. 1€ de frais de gestion est inclus et revient à Airsoft Compagnon.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/parties')}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-airsoft-red hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⊙</span>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Créer la partie
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CreateParty;
