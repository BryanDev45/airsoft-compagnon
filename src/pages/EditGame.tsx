
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";

// Layout Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// Form Components
import GeneralInfoSection from "@/components/party/GeneralInfoSection";
import LocationSection from "@/components/party/LocationSection";
import ProtectionSection from "@/components/party/ProtectionSection";
import ConsumablesSection from "@/components/party/ConsumablesSection";
import PowerLimitsSection from "@/components/party/PowerLimitsSection";
import SettingsSection from "@/components/party/SettingsSection";
import ImageUploadSection from "@/components/party/ImageUploadSection";
import { useGameEdit } from '@/hooks/useGameEdit';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Utiliser notre nouveau hook
  const { 
    form, 
    loading, 
    saving, 
    gameData, 
    canEdit, 
    images, 
    preview, 
    handleImageChange, 
    removeImage, 
    onSubmit, 
    updateFormData 
  } = useGameEdit(id);

  // Game types options
  const gameTypes = [
    { value: "dominicale", label: "Partie Dominicale" },
    { value: "operation", label: "Opération" },
    { value: "rpg", label: "Role-play (RPG)" },
    { value: "speedqb", label: "SpeedQB" },
    { value: "milsim", label: "MilSim" },
    { value: "entrainement", label: "Entraînement" },
    { value: "autre", label: "Autre" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Chargement des données de la partie...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!canEdit || !gameData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
              <p className="mb-6 text-gray-600">
                Vous n'avez pas les droits nécessaires pour modifier cette partie.
              </p>
              <Button 
                className="bg-airsoft-red text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => navigate('/parties')}
              >
                Retour à la recherche de parties
              </Button>
            </div>
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
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-2xl font-bold mb-6">Modifier ma partie</h1>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <GeneralInfoSection 
                  updateFormData={updateFormData} 
                  initialData={gameData}
                  gameTypes={gameTypes}
                />
                <LocationSection 
                  updateFormData={updateFormData} 
                  initialData={gameData}
                />
                <PowerLimitsSection 
                  updateFormData={updateFormData} 
                  initialData={gameData}
                />
                <ProtectionSection 
                  updateFormData={updateFormData} 
                  initialData={gameData}
                />
                <ConsumablesSection 
                  updateFormData={updateFormData} 
                  initialData={gameData}
                />
                <SettingsSection 
                  updateFormData={updateFormData} 
                  initialData={gameData}
                />
                <div className="border-t border-gray-200 pt-8">
                  <ImageUploadSection 
                    images={images}
                    preview={preview}
                    handleImageChange={handleImageChange}
                    removeImage={removeImage}
                    updateFormData={updateFormData}
                    initialData={gameData}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={() => navigate(`/game/${id}`)} 
                    type="button"
                    variant="outline" 
                    className="mr-4"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="bg-airsoft-red hover:bg-red-700"
                  >
                    {saving ? (
                      <>
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                        Enregistrement...
                      </>
                    ) : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditGame;
