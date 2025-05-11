import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadGameImages } from "@/utils/supabaseHelpers";
import { GameData } from '@/types/game';

// Form schema definition
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

export type GameFormValues = z.infer<typeof gameFormSchema>;

export const useGameEdit = (gameId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gameData, setGameData] = useState<GameData | null>(null);
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
      if (!gameId) return;

      try {
        // Get game data
        const { data: game, error: gameError } = await supabase
          .from('airsoft_games')
          .select('*')
          .eq('id', gameId)
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
          navigate(`/game/${gameId}`);
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
          navigate(`/game/${gameId}`);
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
        
        console.log("Images existantes chargées:", images);
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
  }, [gameId, navigate, toast, form]);

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
      
      // Update preview with both existing and new images
      setPreview([...existingImages, ...preview.slice(existingImages.length), ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Create a copy of the preview array
    const newPreview = [...preview];
    
    // Check if we're removing an existing image or a new one
    if (index < existingImages.length) {
      // Removing an existing image
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
      
      // Remove from preview
      newPreview.splice(index, 1);
      setPreview(newPreview);
    } else {
      // Removing a new image
      const adjustedIndex = index - existingImages.length;
      
      // Remove from images array
      const newImages = [...images];
      newImages.splice(adjustedIndex, 1);
      setImages(newImages);
      
      // Remove from preview
      newPreview.splice(index, 1);
      setPreview(newPreview);
    }
  };

  const onSubmit = async (data: GameFormValues) => {
    if (!gameId || !canEdit || !gameData) return;

    setSaving(true);
    try {
      // Prepare game data for update
      const updateData: any = {
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

      // Gérer les images existantes d'abord
      // Réinitialiser tous les champs d'image à null
      const pictureFields = ['Picture1', 'Picture2', 'Picture3', 'Picture4', 'Picture5'];
      pictureFields.forEach(field => {
        updateData[field] = null;
      });

      // Puis ajouter les images existantes conservées
      existingImages.forEach((img, index) => {
        if (index < 5) {
          updateData[`Picture${index + 1}`] = img;
        }
      });

      console.log("Données de mise à jour initiales:", updateData);

      // Mettre à jour les données du jeu dans la base de données
      const { error: updateError } = await supabase
        .from('airsoft_games')
        .update(updateData)
        .eq('id', gameId);

      if (updateError) throw updateError;

      // Télécharger les nouvelles images si nécessaire
      if (images.length > 0) {
        console.log("Téléchargement de nouvelles images:", images.length);
        
        // CORRECTION: Utiliser directement uploadGameImages qui gère maintenant la mise à jour des champs Picture1-5
        const { data: imageUrls, error: imageError } = await uploadGameImages(gameId, images);
        
        if (imageError) {
          console.error("Erreur lors du téléchargement des images:", imageError);
          toast({
            title: "Attention",
            description: "La partie a été modifiée mais certaines images n'ont pas pu être téléchargées",
            variant: "destructive"
          });
        } else {
          console.log("Images téléchargées et enregistrées avec succès");
        }
      }

      toast({
        title: "Partie modifiée avec succès",
        description: "Votre partie a été mise à jour"
      });
      
      navigate(`/game/${gameId}`);
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

  return {
    form,
    loading,
    saving,
    gameData,
    canEdit,
    images,
    preview,
    existingImages,
    handleImageChange,
    removeImage,
    onSubmit,
    updateFormData
  };
};
