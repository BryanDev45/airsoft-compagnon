
import { useState } from 'react';
import { usePartyForm } from '@/hooks/usePartyForm';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useLastGame } from '@/hooks/useLastGame';
import { useLastGameImages } from '@/hooks/useLastGameImages';
import { toast } from "@/components/ui/use-toast";

export const useCreatePartyForm = () => {
  const [hasFilledFromLastGame, setHasFilledFromLastGame] = useState(false);
  
  const { 
    images, 
    preview, 
    handleImageChange, 
    removeImage,
    setImages,
    setPreview
  } = useImageUpload(5);
  
  const { form, isSubmitting, onSubmit } = usePartyForm(images);
  const { lastGame, isLoading } = useLastGame();
  const { isLoadingImages, fetchLastGameImages, convertUrlsToFiles } = useLastGameImages();

  const fillFromLastGame = async () => {
    if (!lastGame || hasFilledFromLastGame) return;
    
    // Créer les dates avec les heures par défaut
    const startDateTime = new Date();
    startDateTime.setHours(parseInt(lastGame.start_time.split(':')[0]), parseInt(lastGame.start_time.split(':')[1]), 0, 0);
    
    const endDateTime = new Date();
    endDateTime.setHours(parseInt(lastGame.end_time.split(':')[0]), parseInt(lastGame.end_time.split(':')[1]), 0, 0);
    
    // Préremplir tous les champs du formulaire
    form.reset({
      title: lastGame.title,
      description: lastGame.description,
      rules: lastGame.rules,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      address: lastGame.address,
      city: lastGame.city,
      zipCode: lastGame.zip_code,
      maxPlayers: lastGame.max_players.toString(),
      price: lastGame.price.toString(),
      gameType: lastGame.game_type,
      manualValidation: lastGame.manual_validation,
      hasToilets: lastGame.has_toilets,
      hasParking: lastGame.has_parking,
      hasEquipmentRental: lastGame.has_equipment_rental,
      aeg_fps_min: lastGame.aeg_fps_min.toString(),
      aeg_fps_max: lastGame.aeg_fps_max.toString(),
      dmr_fps_max: lastGame.dmr_fps_max.toString(),
      eyeProtectionRequired: lastGame.eye_protection_required,
      fullFaceProtectionRequired: lastGame.full_face_protection_required,
      hpaAllowed: lastGame.hpa_allowed,
      polarStarAllowed: lastGame.polarstar_allowed,
      tracersAllowed: lastGame.tracers_allowed,
      grenadesAllowed: lastGame.grenades_allowed,
      smokesAllowed: lastGame.smokes_allowed,
      pyroAllowed: lastGame.pyro_allowed,
      isPrivate: lastGame.is_private,
      terms: false
    });
    
    // Copy images from last game
    try {
      const imageUrls = await fetchLastGameImages(lastGame.id);
      if (imageUrls.length > 0) {
        const imageFiles = await convertUrlsToFiles(imageUrls);
        if (imageFiles.length > 0) {
          setImages(imageFiles);
          const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
          setPreview(newPreviews);
          
          toast({
            title: "Images copiées",
            description: `${imageFiles.length} image(s) de votre dernière partie ont été ajoutées`,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la copie des images:', error);
      toast({
        title: "Attention",
        description: "Les informations ont été copiées mais les images n'ont pas pu être récupérées",
        variant: "destructive"
      });
    }
    
    setHasFilledFromLastGame(true);
    
    toast({
      title: "Informations préremplies",
      description: "Les informations de votre dernière partie ont été copiées dans le formulaire"
    });
  };

  // Condition stable pour afficher le bouton
  const shouldShowCopyButton = lastGame && !isLoading && !hasFilledFromLastGame;

  return {
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
  };
};
