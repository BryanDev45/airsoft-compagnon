
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Form } from "@/components/ui/form";
import { ScrollToTop } from "../components/ui/scroll-to-top";

// Import component sections
import GeneralInfoSection from '@/components/party/GeneralInfoSection';
import LocationSection from '@/components/party/LocationSection';
import PowerLimitsSection from '@/components/party/PowerLimitsSection';
import ProtectionSection from '@/components/party/ProtectionSection';
import ConsumablesSection from '@/components/party/ConsumablesSection';
import SettingsSection from '@/components/party/SettingsSection';
import ImageUploadSection from '@/components/party/ImageUploadSection';
import CreatePartyHeader from '@/components/party/CreatePartyHeader';
import CreatePartyTerms from '@/components/party/CreatePartyTerms';
import CreatePartyActions from '@/components/party/CreatePartyActions';

// Import hooks
import { useCreatePartyForm } from '@/hooks/party/useCreatePartyForm';

const gameTypes = [{
  value: "dominicale",
  label: "Dominicale"
}, {
  value: "operation",
  label: "Opé"
}];

const CreateParty = () => {
  const {
    form,
    isSubmitting,
    onSubmit,
    images,
    preview,
    handleImageChange,
    removeImage,
    fillFromLastGame,
    shouldShowCopyButton,
    isLoadingImages
  } = useCreatePartyForm();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
          <CreatePartyHeader 
            shouldShowCopyButton={shouldShowCopyButton}
            fillFromLastGame={fillFromLastGame}
            isLoadingImages={isLoadingImages}
          />
          
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
              <CreatePartyTerms form={form} />
              
              {/* Submit Buttons */}
              <CreatePartyActions isSubmitting={isSubmitting} />
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
