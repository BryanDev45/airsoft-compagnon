
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import StoreLocationSection from './StoreLocationSection';
import StoreContactSection from './StoreContactSection';
import StoreImageUploadSection from './StoreImageUploadSection';

interface StoreFormProps {
  form: UseFormReturn<any>;
  isGeocoding: boolean;
  coordinates: [number, number] | null;
  handleAddressChange: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  images: File[];
  preview: string[];
  onSubmit: (values: any) => void;
}

const StoreForm = ({
  form,
  isGeocoding,
  coordinates,
  handleAddressChange,
  handleImageChange,
  removeImage,
  images,
  preview,
  onSubmit
}: StoreFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Nom du magasin *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Airsoft Shop" 
                  {...field} 
                  className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6 pt-2">
          <h3 className="text-sm font-medium text-neutral-700">Localisation</h3>
          <StoreLocationSection 
            form={form}
            isGeocoding={isGeocoding}
            coordinates={coordinates}
            handleAddressChange={handleAddressChange}
          />
        </div>

        <div className="space-y-6 pt-2">
          <h3 className="text-sm font-medium text-neutral-700">Contact</h3>
          <StoreContactSection form={form} />
        </div>
        
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium text-neutral-700">Images</h3>
          <StoreImageUploadSection 
            images={images}
            preview={preview}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
          />
        </div>
      </form>
    </Form>
  );
};

export default StoreForm;
