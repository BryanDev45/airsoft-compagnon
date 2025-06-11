
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadGameImages } from "@/utils/supabaseHelpers";
import { GameFormValues } from './useGameEditForm';

export const useGameEditSubmit = (gameId: string | undefined, canEdit: boolean, existingImages: string[], images: File[]) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data: GameFormValues) => {
    if (!gameId || !canEdit) return;

    setSaving(true);
    try {
      // Extraire les données de date et heure des objets Date
      const startDate = data.startDateTime.toISOString().split('T')[0];
      const endDate = data.endDateTime.toISOString().split('T')[0];
      const startTime = data.startDateTime.toTimeString().split(' ')[0];
      const endTime = data.endDateTime.toTimeString().split(' ')[0];

      // Prepare game data for update
      const updateData: any = {
        title: data.title,
        description: data.description,
        rules: data.rules,
        date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
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

      // Handle existing images
      const pictureFields = ['Picture1', 'Picture2', 'Picture3', 'Picture4', 'Picture5'];
      pictureFields.forEach(field => {
        updateData[field] = null;
      });

      existingImages.forEach((img, index) => {
        if (index < 5) {
          updateData[`Picture${index + 1}`] = img;
        }
      });

      console.log("Données de mise à jour initiales avec images existantes:", updateData);

      const { error: updateError } = await supabase
        .from('airsoft_games')
        .update(updateData)
        .eq('id', gameId);

      if (updateError) throw updateError;

      if (images.length > 0) {
        console.log(`Téléchargement de ${images.length} nouvelles images`);
        
        const { data: imageUrls, error: imageError } = await uploadGameImages(gameId, images);
        
        if (imageError) {
          console.error("Erreur lors du téléchargement des images:", imageError);
          toast({
            title: "Attention",
            description: "La partie a été modifiée mais certaines images n'ont pas pu être téléchargées",
            variant: "destructive"
          });
        } else {
          console.log("Images téléchargées et enregistrées avec succès:", imageUrls);
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
    saving,
    onSubmit
  };
};
