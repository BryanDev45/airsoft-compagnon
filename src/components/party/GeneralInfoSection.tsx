import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GeneralInfoSectionProps } from "@/types/party";

interface GameType {
  value: string;
  label: string;
}

const GeneralInfoSection = ({ updateFormData, initialData, gameTypes }: GeneralInfoSectionProps) => {
  const form = useFormContext();
  const [startTimeDialog, setStartTimeDialog] = useState(false);
  const [endTimeDialog, setEndTimeDialog] = useState(false);
  
  // Define default game types if not provided as props
  const defaultGameTypes = [
    { value: "dominicale", label: "Dominicale" },
    { value: "operation", label: "Opé" }
  ];
  
  // Use provided gameTypes or default ones
  const availableGameTypes = gameTypes || defaultGameTypes;

  // If we're in edit mode with initialData, update the form
  useEffect(() => {
    if (initialData) {
      // Update form with initialData if available
      form.setValue('title', initialData.title || '');
      form.setValue('description', initialData.description || '');
      form.setValue('rules', initialData.rules || '');
      form.setValue('startDateTime', initialData.startDateTime ? new Date(initialData.startDateTime) : null);
      form.setValue('endDateTime', initialData.endDateTime ? new Date(initialData.endDateTime) : null);
      form.setValue('gameType', initialData.gameType || 'dominicale');
    }
  }, [initialData, form]);
  
  // Fonction pour gérer la sélection de l'heure
  const handleTimeSelection = (field: any, hour: number, minute: number, closeDialog: () => void) => {
    const currentDate = field.value ? new Date(field.value) : new Date();
    const newDate = setMinutes(setHours(currentDate, hour), minute);
    field.onChange(newDate);
    
    // Notify parent component
    if (field.name === 'startDateTime') {
      updateFormData && updateFormData('generalInfo', { startDateTime: newDate });
    } else if (field.name === 'endDateTime') {
      updateFormData && updateFormData('generalInfo', { endDateTime: newDate });
    }
    
    closeDialog();
  };
  
  // Handle form changes to update parent component
  const handleFieldChange = (field: string, value: any) => {
    if (updateFormData) {
      updateFormData('generalInfo', { [field]: value });
    }
  };
  
  // Fonction pour générer les options d'heures
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        options.push({
          hour,
          minute,
          label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        });
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-airsoft-red" />
          Informations générales
        </CardTitle>
        <CardDescription>
          Les informations principales de votre partie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField 
          control={form.control} 
          name="title" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la partie</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Partie CQB au Bunker" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('title', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="description" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Décrivez votre partie, les règles spéciales, etc." 
                  className="min-h-[120px]" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('description', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="rules" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Règles de la partie</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Décrivez les règles spécifiques de votre partie..." 
                  className="min-h-[120px]" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('rules', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="startDateTime" 
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date et heure de début</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className="w-full pl-3 text-left font-normal flex-grow">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd MMMM yyyy", { locale: fr }) : <span>Sélectionnez la date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={(date) => {
                          if (date) {
                            // Préserve l'heure actuelle lors de la sélection d'une nouvelle date
                            const newDate = new Date(date);
                            if (field.value) {
                              newDate.setHours(field.value.getHours(), field.value.getMinutes());
                            }
                            field.onChange(newDate);
                            handleFieldChange('startDateTime', newDate);
                          }
                        }} 
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setStartTimeDialog(true)} 
                    type="button"
                    className="flex-shrink-0"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "HH:mm") : "00:00"}
                  </Button>
                </div>
                <FormMessage />
                
                {/* Dialogue de sélection d'heure pour l'heure de début */}
                <Dialog open={startTimeDialog} onOpenChange={setStartTimeDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Sélectionner l'heure de début</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2">
                      {timeOptions.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleTimeSelection(field, option.hour, option.minute, () => setStartTimeDialog(false))}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="endDateTime" 
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date et heure de fin</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className="w-full pl-3 text-left font-normal flex-grow">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd MMMM yyyy", { locale: fr }) : <span>Sélectionnez la date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={(date) => {
                          if (date) {
                            // Préserve l'heure actuelle lors de la sélection d'une nouvelle date
                            const newDate = new Date(date);
                            if (field.value) {
                              newDate.setHours(field.value.getHours(), field.value.getMinutes());
                            }
                            field.onChange(newDate);
                            handleFieldChange('endDateTime', newDate);
                          }
                        }}
                        disabled={(date) => {
                          const startDate = form.getValues("startDateTime");
                          const startDateCopy = new Date(startDate);
                          startDateCopy.setHours(0, 0, 0, 0);
                          
                          const dateToCheck = new Date(date);
                          dateToCheck.setHours(0, 0, 0, 0);
                          
                          return dateToCheck < startDateCopy;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setEndTimeDialog(true)} 
                    type="button"
                    className="flex-shrink-0"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "HH:mm") : "00:00"}
                  </Button>
                </div>
                <FormMessage />
                
                {/* Dialogue de sélection d'heure pour l'heure de fin */}
                <Dialog open={endTimeDialog} onOpenChange={setEndTimeDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Sélectionner l'heure de fin</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2">
                      {timeOptions.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleTimeSelection(field, option.hour, option.minute, () => setEndTimeDialog(false))}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </FormItem>
            )} 
          />
        </div>
        
        <FormField
          control={form.control}
          name="gameType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de partie</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange('gameType', value);
                  }}
                  value={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  {availableGameTypes.map((gameType) => (
                    <FormItem key={gameType.value}>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={gameType.value}
                            id={gameType.value}
                            className="sr-only" 
                          />
                          <label
                            htmlFor={gameType.value}
                            className={`flex-1 cursor-pointer rounded-md border p-4 text-center hover:bg-airsoft-red hover:text-white transition-colors ${
                              field.value === gameType.value ? 'bg-airsoft-red text-white' : 'bg-gray-100'
                            }`}
                          >
                            {gameType.label}
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default GeneralInfoSection;
