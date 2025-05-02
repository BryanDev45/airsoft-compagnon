
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
  date: z.date({
    required_error: "Une date est requise"
  }),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  zipCode: z.string().min(5, "Le code postal est requis"),
  maxPlayers: z.string().min(1, "Le nombre maximum de joueurs est requis"),
  price: z.string(),
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
});

export type PartyFormValues = z.infer<typeof partyFormSchema>;

export const usePartyForm = (images: File[]) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      rules: "",
      startTime: "10:00",
      endTime: "17:00",
      address: "",
      city: "",
      zipCode: "",
      maxPlayers: "20",
      price: "0",
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
      
      // Préparer les données à enregistrer
      const gameData = {
        title: data.title,
        description: data.description,
        rules: data.rules,
        date: data.date.toISOString().split('T')[0],  // Format YYYY-MM-DD
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
        created_by: userData.user.id
      };
      
      // Créer la partie dans la base de données
      const { data: gameResult, error } = await createAirsoftGame(gameData);
      
      if (error || !gameResult) {
        throw new Error(error?.message || "Erreur lors de la création de la partie");
      }
      
      // Si des images ont été téléchargées, les enregistrer
      if (images.length > 0) {
        const { error: imageError } = await uploadGameImages(gameResult.id, images);
        
        if (imageError) {
          console.error("Erreur lors du téléchargement des images:", imageError);
          toast({
            title: "Attention",
            description: "La partie a été créée mais certaines images n'ont pas pu être téléchargées",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Partie créée avec succès",
        description: "Votre partie a été publiée et est maintenant visible par les autres joueurs"
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
