import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadGameImages } from "@/utils/supabaseHelpers";

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

// Formulaire schéma
const gameFormSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  rules: z.string().min(10, "Les règles doivent comporter au moins 10 caractères"),
  date: z.string().min(1, "La date est requise"),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  zipCode: z.string().min(5, "Le code postal est requis"),
  maxPlayers: z.string().min(1, "Le nombre maximum de joueurs est requis"),
  price: z.string()
    .refine(val => {
      const numVal = parseFloat(val);
      return !isNaN(numVal) && numVal >= 5;
    }, "Le prix minimum est de 5€"),
  gameType: z.string().min(1, "Le type de jeu est requis"),
  manualValidation: z.boolean().default(false),
  hasToilets: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasEquipmentRental: z.boolean().default(false),
  aeg_fps_min: z.string().default("280"),
  aeg_fps_max: z.string().default("350"),
  dmr_fps_max: z.string().default("450"),
  eyeProtectionRequired: z.boolean().default(true),
  fullFaceProtectionRequired: z.boolean().default(false),
  hpaAllowed: z.boolean().default(true),
  polarStarAllowed: z.boolean().default(true),
  tracersAllowed: z.boolean().default(true),
  grenadesAllowed: z.boolean().default(true),
  smokesAllowed: z.boolean().default(false),
  pyroAllowed: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: "",
      description: "",
      rules: "",
      date: "",
      startTime: "",
      endTime: "",
      address: "",
      city: "",
      zipCode: "",
      maxPlayers: "20",
      price: "5",
      gameType: "",
      manualValidation: false,
      hasToilets: false,
      hasParking: false,
      hasEquipmentRental: false,
      aeg_fps_min: "280",
      aeg_fps_max: "350",
      dmr_fps_max: "450",
      eyeProtectionRequired: true,
      fullFaceProtectionRequired: false,
      hpaAllowed: true,
      polarStarAllowed: true,
      tracersAllowed: true,
      grenadesAllowed: true,
      smokesAllowed: false,
      pyroAllowed: false,
      isPrivate: false
    }
  });

  const updateFormData = (section: string, data: any) => {
    setFormData(prevData => {
      if (!prevData) {
        return { [section]: data };
      }
      return { ...prevData, [section]: { ...prevData[section], ...data } };
    });
  };

  // Fetch game data
  useEffect(() => {
    const fetchGameData = async () => {
      if (!id) return;

      try {
        // Get game data
        const { data: game, error: gameError } = await supabase
          .from('airsoft_games')
          .select('*')
          .eq('id', id)
          .single();

        if (gameError) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de la partie",
            variant: "destructive"
          });
          navigate('/parties');
          return;
        }

        // Check if user is creator
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Non autorisé",
            description: "Vous devez être connecté pour modifier une partie",
            variant: "destructive"
          });
          navigate(`/game/${id}`);
          return;
        }

        const isCreator = session.user.id === game.created_by;
        
        // Check if game date has passed
        const gameDate = new Date(game.date);
        const today = new Date();
        const isPastGame = gameDate < today;

        if (!isCreator || isPastGame) {
          toast({
            title: "Non autorisé",
            description: isPastGame ? 
              "Impossible de modifier une partie passée" : 
              "Vous n'êtes pas l'organisateur de cette partie",
            variant: "destructive"
          });
          navigate(`/game/${id}`);
          return;
        }

        setCanEdit(true);
        setGameData(game);

        // Initialize form values
        form.reset({
          title: game.title,
          description: game.description,
          rules: game.rules,
          date: game.date,
          startTime: game.start_time,
          endTime: game.end_time,
          address: game.address,
          city: game.city,
          zipCode: game.zip_code,
          maxPlayers: game.max_players.toString(),
          price: game.price ? game.price.toString() : "5",
          gameType: game.game_type,
          manualValidation: game.manual_validation,
          hasToilets: game.has_toilets,
          hasParking: game.has_parking,
          hasEquipmentRental: game.has_equipment_rental,
          aeg_fps_min: game.aeg_fps_min ? game.aeg_fps_min.toString() : "280",
          aeg_fps_max: game.aeg_fps_max ? game.aeg_fps_max.toString() : "350",
          dmr_fps_max: game.dmr_fps_max ? game.dmr_fps_max.toString() : "450",
          eyeProtectionRequired: game.eye_protection_required,
          fullFaceProtectionRequired: game.full_face_protection_required,
          hpaAllowed: game.hpa_allowed,
          polarStarAllowed: game.polarstar_allowed,
          tracersAllowed: game.tracers_allowed,
          grenadesAllowed: game.grenades_allowed,
          smokesAllowed: game.smokes_allowed,
          pyroAllowed: game.pyro_allowed,
          isPrivate: game.is_private
        });

        // Load existing images
        const images = [];
        if (game.Picture1) images.push(game.Picture1);
        if (game.Picture2) images.push(game.Picture2);
        if (game.Picture3) images.push(game.Picture3);
        if (game.Picture4) images.push(game.Picture4);
        if (game.Picture5) images.push(game.Picture5);
        setExistingImages(images);
        setPreview(images);

      } catch (error) {
        console.error("Error fetching game data:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id, navigate, toast, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalImages = images.length + newFiles.length + existingImages.length;
      
      if (totalImages > 5) {
        toast({
          title: "Limite atteinte",
          description: "Vous ne pouvez pas ajouter plus de 5 images au total",
          variant: "destructive"
        });
        return;
      }
      
      // Add files to images state
      setImages([...images, ...newFiles]);
      
      // Generate preview for new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreview([...preview, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newPreview = [...preview];
    // Check if we're removing an existing image or a new one
    if (index < existingImages.length) {
      // Remove existing image
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
      newPreview.splice(index, 1);
    } else {
      // Remove new image
      const newImages = [...images];
      const adjustedIndex = index - existingImages.length;
      newImages.splice(adjustedIndex, 1);
      setImages(newImages);
      newPreview.splice(index, 1);
    }
    setPreview(newPreview);
  };

  const onSubmit = async (data: GameFormValues) => {
    if (!id || !canEdit || !gameData) return;

    setSaving(true);
    try {
      // Prepare game data for update
      const updateData = {
        title: data.title,
        description: data.description,
        rules: data.rules,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        address: data.address,
        city: data.city,
        zip_code: data.zipCode,
        max_players: parseInt(data.maxPlayers),
        price: parseFloat(data.price),
        game_type: data.gameType,
        manual_validation: data.manualValidation,
        has_toilets: data.hasToilets,
        has_parking: data.hasParking,
        has_equipment_rental: data.hasEquipmentRental,
        aeg_fps_min: parseInt(data.aeg_fps_min),
        aeg_fps_max: parseInt(data.aeg_fps_max),
        dmr_fps_max: parseInt(data.dmr_fps_max),
        eye_protection_required: data.eyeProtectionRequired,
        full_face_protection_required: data.fullFaceProtectionRequired,
        hpa_allowed: data.hpaAllowed,
        polarstar_allowed: data.polarStarAllowed,
        tracers_allowed: data.tracersAllowed,
        grenades_allowed: data.grenadesAllowed,
        smokes_allowed: data.smokesAllowed,
        pyro_allowed: data.pyroAllowed,
        is_private: data.isPrivate,
      };

      // Gestion des images existantes
      // Réinitialisation des champs d'images pour n'inclure que les images existantes
      const pictureFields = ['Picture1', 'Picture2', 'Picture3', 'Picture4', 'Picture5'];
      pictureFields.forEach((field, index) => {
        updateData[field] = index < existingImages.length ? existingImages[index] : null;
      });

      console.log("Données de mise à jour initiales:", updateData);

      // Update game data in the database
      const { error: updateError } = await supabase
        .from('airsoft_games')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Upload new images if any
      if (images.length > 0) {
        console.log("Téléchargement de nouvelles images:", images.length);
        const { data: imageUrls, error: imageError } = await uploadGameImages(id, images);
        
        if (imageError) {
          console.error("Erreur lors du téléchargement des images du jeu:", imageError);
          toast({
            title: "Attention",
            description: "La partie a été modifiée mais certaines images n'ont pas pu être téléchargées",
            variant: "destructive"
          });
        } else if (imageUrls && imageUrls.length > 0) {
          console.log("Images téléchargées avec succès, URLs:", imageUrls);
          
          // Mettre à jour les champs d'images avec les nouvelles URLs
          // en commençant à partir du premier champ d'image vide
          const updateImagesData: Record<string, string> = {};
          let pictureIndex = existingImages.length;

          // Log pour débogage
          console.log("existingImages.length:", existingImages.length);
          console.log("pictureIndex au début:", pictureIndex);

          for (let i = 0; i < imageUrls.length; i++) {
            // S'assurer qu'on ne dépasse pas Picture5
            if (pictureIndex >= 5) break;
            
            const fieldName = `Picture${pictureIndex + 1}`;
            updateImagesData[fieldName] = imageUrls[i];
            console.log(`Affectation de ${imageUrls[i]} à ${fieldName}`);
            
            pictureIndex++;
          }
          
          console.log("Données de mise à jour des images:", updateImagesData);
          
          if (Object.keys(updateImagesData).length > 0) {
            const { error: updateImagesError } = await supabase
              .from('airsoft_games')
              .update(updateImagesData)
              .eq('id', id);
              
            if (updateImagesError) {
              console.error("Erreur lors de la mise à jour des URLs d'images:", updateImagesError);
            } else {
              console.log("Les URLs des images ont été mises à jour avec succès");
            }
          }
        }
      }

      toast({
        title: "Partie modifiée avec succès",
        description: "Votre partie a été mise à jour"
      });
      
      navigate(`/game/${id}`);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du jeu:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors de la modification de la partie",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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
