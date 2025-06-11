
import { useState } from 'react';
import { useGameEditData } from './game/useGameEditData';
import { useGameEditForm } from './game/useGameEditForm';
import { useGameEditImages } from './game/useGameEditImages';
import { useGameEditSubmit } from './game/useGameEditSubmit';

export const useGameEdit = (gameId: string | undefined) => {
  const [formData, setFormData] = useState<any>({});

  const { loading, gameData, canEdit, isUserAdmin } = useGameEditData(gameId);
  const { form } = useGameEditForm(gameData);
  const { images, preview, existingImages, handleImageChange, removeImage } = useGameEditImages(gameData);
  const { saving, onSubmit } = useGameEditSubmit(gameId, canEdit, existingImages, images);

  const updateFormData = (section: string, data: any) => {
    setFormData(prevData => {
      if (!prevData) {
        return { [section]: data };
      }
      return { ...prevData, [section]: { ...prevData[section], ...data } };
    });
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
    updateFormData,
    isUserAdmin
  };
};

export type { GameFormValues } from './game/useGameEditForm';
