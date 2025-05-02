
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { usePartyForm } from '@/hooks/usePartyForm';
import { ScrollToTop } from "../components/ui/scroll-to-top";

// Import component sections
import GeneralInfoSection from '@/components/party/GeneralInfoSection';
import LocationSection from '@/components/party/LocationSection';
import PowerLimitsSection from '@/components/party/PowerLimitsSection';
import ProtectionSection from '@/components/party/ProtectionSection';
import ConsumablesSection from '@/components/party/ConsumablesSection';
import SettingsSection from '@/components/party/SettingsSection';
import ImageUploadSection from '@/components/party/ImageUploadSection';

const gameTypes = [{
  value: "cqb",
  label: "CQB"
}, {
  value: "woodland",
  label: "Woodland"
}, {
  value: "milsim",
  label: "Milsim"
}, {
  value: "speedsoft",
  label: "Speedsoft"
}, {
  value: "scenario",
  label: "Scénario"
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Créer une partie d'airsoft</h1>
            <p className="text-gray-600">Remplissez le formulaire ci-dessous pour organiser votre partie d'airsoft</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* General Information Section */}
              <GeneralInfoSection gameTypes={gameTypes} />
              
              {/* Location Section */}
              <LocationSection />
              
              {/* Power Limits Section */}
              <PowerLimitsSection />
              
              {/* Protection Section */}
              <ProtectionSection />
              
              {/* Consumables Section */}
              <ConsumablesSection />
              
              {/* Settings Section */}
              <SettingsSection />
              
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
