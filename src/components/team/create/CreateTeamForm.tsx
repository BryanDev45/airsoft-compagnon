
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { TeamFormData } from './teamSchema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { NavigateFunction } from 'react-router-dom';

interface CreateTeamFormProps {
  register: UseFormRegister<TeamFormData>;
  handleSubmit: (onSubmit: (data: TeamFormData) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: (data: TeamFormData) => void;
  errors: FieldErrors<TeamFormData>;
  isSubmitting: boolean;
  setValue: UseFormSetValue<TeamFormData>;
  navigate: NavigateFunction;
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
  setValue,
  navigate,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'équipe</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? "border-red-500" : ""}
            placeholder="Les Invincibles"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message?.toString()}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description de l'équipe</Label>
          <Textarea
            id="description"
            {...register('description')}
            rows={4}
            placeholder="Présentez votre équipe en quelques mots..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            type="text"
            placeholder="Paris, France"
            {...register('location')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact">Email de contact</Label>
          <Input
            id="contact"
            type="email"
            {...register('contact')}
            className={errors.contact ? "border-red-500" : ""}
            placeholder="contact@equipe.fr"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs mt-1">{errors.contact.message?.toString()}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAssociation"
            onCheckedChange={(checked) => setValue('isAssociation', !!checked)}
          />
          <Label htmlFor="isAssociation" className="text-sm">
            Cette équipe est une association loi 1901
          </Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Annuler
        </Button>
        
        <Button
          type="submit"
          className="bg-airsoft-red hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création en cours..." : "Créer l'équipe"}
        </Button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
