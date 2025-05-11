import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { createAirsoftGame, uploadGameImages } from "@/utils/supabaseHelpers";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

// Form schema definition
const partyFormSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  rules: z.string().min(10, "Les règles doivent comporter au moins 10 caractères"),
  startDateTime: z.date({
    required_error: "La date et l'heure de début sont requises"
  }),
  endDateTime: z.date({
    required_error: "La date et l'heure de fin sont requises"
  }),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  zipCode: z.string().min(5, "Le code postal est requis"),
  maxPlayers: z.string().min(1, "Le nombre maximum de joueurs est requis"),
  price: z.string()
    .refine(val => {
      const numVal = parseFloat(val);
      return !isNaN(numVal) && numVal >= 5;
    }, "Le prix minimum est de 5€ (incluant les frais de gestion)"),
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
  terms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions"
  }),
  isPrivate: z.boolean().default(false)
}).refine((data) => {
  return data.endDateTime >= data.startDateTime;
}, {
  message: "La date et l'heure de fin doivent être égales ou postérieures à la date et l'heure de début",
  path: ["endDateTime"]
});

export type PartyFormValues = z.infer<typeof partyFormSchema>;

export const usePartyForm = (images: File[]) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Calculer la date actuelle et les valeurs par défaut
  const now = new Date();
  const startDateTime = new Date(now);
  startDateTime.setHours(10, 0, 0, 0); // 10:00 par défaut
  
  const endDateTime = new Date(now);
  endDateTime.setHours(17, 0, 0, 0); // 17:00 par défaut
  
  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      rules: "",
      startDateTime,
      endDateTime,
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
      terms: false,
      isPrivate: false
    }
  });

  // Fonction pour gérer le téléchargement des images et la mise à jour du jeu
  const handleImageUpload = async (gameId: string, images: File[]): Promise<{ success: boolean, imageUrls?: string[], error?: any, errorMessage?: string }> => {
    if (images.length === 0) {
      console.log("Aucune image à télécharger");
      return { success: true, imageUrls: [] };
    }
    
    try {
      console.log(`Téléchargement de ${images.length} images pour la partie ${gameId}`);
      const { data: imageUrls, error: uploadError } = await uploadGameImages(gameId, images);
      
      if (uploadError) {
        console.error("Erreur lors du téléchargement des images:", uploadError);
        return { 
          success: false, 
          error: uploadError,
          errorMessage: "Certaines images n'ont pas pu être téléchargées" 
        };
      }
      
      if (!imageUrls || imageUrls.length === 0) {
        console.warn("Aucune URL d'image n'a été retournée après le téléchargement");
        return { success: true, imageUrls: [] };
      }
      
      // Les mises à jour des URL dans la base de données sont maintenant gérées par uploadGameImages
      console.log("URLs des images téléchargées avec succès");
      return { success: true, imageUrls };
      
    } catch (error) {
      console.error("Erreur inattendue lors du téléchargement des images:", error);
      return { 
        success: false, 
        error, 
        errorMessage: "Une erreur inattendue est survenue lors du téléchargement des images" 
      };
    }
  };

  // Fonction pour créer une partie
  const createGame = async (gameData: any): Promise<{ success: boolean, gameId?: string, error?: any }> => {
    try {
      const { data: gameResult, error } = await createAirsoftGame(gameData);
      
      if (error || !gameResult) {
        throw new Error(error?.message || "Erreur lors de la création de la partie");
      }
      
      console.log("Partie créée avec succès, ID:", gameResult.id);
      return { success: true, gameId: gameResult.id };
    } catch (error) {
      console.error("Erreur lors de la création de la partie:", error);
      return { success: false, error };
    }
  };

  // Fonction pour inscrire l'organisateur à la partie
  const registerOrganizer = async (gameId: string, userId: string): Promise<{ success: boolean, error?: any }> => {
    try {
      const { error: participationError } = await supabase
        .from('game_participants')
        .insert({
          game_id: gameId,
          user_id: userId,
          role: 'Organisateur',
          status: 'Confirmé'
        });
        
      if (participationError) {
        console.error("Erreur lors de l'inscription de l'organisateur:", participationError);
        return { success: false, error: participationError };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'organisateur:", error);
      return { success: false, error };
    }
  };

  const onSubmit = async (data: PartyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté pour créer une partie",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Extraire la date, l'heure de début et l'heure de fin pour la base de données
      const date = data.startDateTime.toISOString().split('T')[0];
      const start_time = `${data.startDateTime.getHours().toString().padStart(2, '0')}:${data.startDateTime.getMinutes().toString().padStart(2, '0')}`;
      const end_time = `${data.endDateTime.getHours().toString().padStart(2, '0')}:${data.endDateTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Préparer les données à enregistrer
      const gameData: any = {
        title: data.title,
        description: data.description,
        rules: data.rules,
        date: date,
        start_time: start_time,
        end_time: end_time,
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
        created_by: userData.user.id
      };
      
      // Créer la partie
      const { success: gameCreated, gameId, error: gameError } = await createGame(gameData);
      
      if (!gameCreated || !gameId) {
        throw new Error(gameError?.message || "Erreur lors de la création de la partie");
      }
      
      // Télécharger les images s'il y en a
      if (images.length > 0) {
        const uploadResult = await handleImageUpload(gameId, images);
        
        if (!uploadResult.success) {
          toast({
            title: "Attention",
            description: uploadResult.errorMessage || "La partie a été créée mais les images n'ont pas pu être téléchargées",
            variant: "destructive"
          });
        }
      }
      
      // Inscrire l'organisateur
      const { success: organizerRegistered, error: registerError } = await registerOrganizer(gameId, userData.user.id);
      
      if (!organizerRegistered) {
        toast({
          title: "Attention",
          description: "La partie a été créée mais vous n'avez pas pu être inscrit automatiquement",
          variant: "destructive"
        });
      }
      
      toast({
        title: "Partie créée avec succès",
        description: "Votre partie a été publiée et vous y êtes automatiquement inscrit"
      });
      
      navigate('/parties');
    } catch (error: any) {
      console.error("Erreur lors de la création de la partie:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors de la création de la partie",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { form, isSubmitting, onSubmit };
};
