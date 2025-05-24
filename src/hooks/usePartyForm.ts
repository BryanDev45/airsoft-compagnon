
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { partyFormSchema, PartyFormValues } from '@/hooks/party/usePartyFormValidation';
import { handleImageUpload, createGame, registerOrganizer } from '@/hooks/party/usePartyFormHelpers';

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

export type { PartyFormValues } from '@/hooks/party/usePartyFormValidation';
