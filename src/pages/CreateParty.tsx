
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Users, Info, Shield, Clock, Euro, Image as ImageIcon, Save, Timer, Eye, Award, AlertCircle } from 'lucide-react';
import { fr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollToTop } from "../components/ui/scroll-to-top";

const partyFormSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  rules: z.string().min(10, "Les règles doivent comporter au moins 10 caractères"),
  date: z.date({
    required_error: "Une date est requise",
  }),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  zipCode: z.string().min(5, "Le code postal est requis"),
  maxPlayers: z.string().min(1, "Le nombre maximum de joueurs est requis"),
  price: z.string(),
  gameType: z.string().min(1, "Le type de jeu est requis"),
  requiresReplica: z.boolean().default(true),
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
    message: "Vous devez accepter les conditions",
  }),
  isPrivate: z.boolean().default(false),
});

type PartyFormValues = z.infer<typeof partyFormSchema>;

const gameTypes = [
  { value: "cqb", label: "CQB" },
  { value: "woodland", label: "Woodland" },
  { value: "milsim", label: "Milsim" },
  { value: "speedsoft", label: "Speedsoft" },
  { value: "scenario", label: "Scénario" },
];

const CreateParty = () => {
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
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
      requiresReplica: true,
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
      isPrivate: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...images, ...filesArray].slice(0, 5);
      setImages(newImages);
      
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreview(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...preview];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreview(newPreviews);
  };

  const onSubmit = (data: PartyFormValues) => {
    console.log("Creating party with data:", data);
    console.log("Images:", images);
    
    setTimeout(() => {
      toast({
        title: "Partie créée avec succès",
        description: "Votre partie a été publiée et est maintenant visible par les autres joueurs",
      });
      navigate('/parties');
    }, 1500);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Créer une partie d'airsoft</h1>
            <p className="text-gray-600">Remplissez le formulaire ci-dessous pour organiser votre partie d'airsoft</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <Input placeholder="Ex: Partie CQB au Bunker" {...field} />
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionnez une date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de début</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de fin</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="gameType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de jeu</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type de jeu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {gameTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-airsoft-red" />
                    Lieu
                  </CardTitle>
                  <CardDescription>
                    L'adresse où se déroulera votre partie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse du terrain" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder="Code postal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-airsoft-red" />
                    Limites de puissance
                  </CardTitle>
                  <CardDescription>
                    Définissez les limites de FPS pour votre partie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">AEG / GBB</h3>
                      <div className="flex space-x-4">
                        <FormField
                          control={form.control}
                          name="aeg_fps_min"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>FPS Min</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} min="0" max="500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="aeg_fps_max"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>FPS Max</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} min="0" max="500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="dmr_fps_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sniper / DMR (FPS Max)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min="0" max="600" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-airsoft-red" />
                    Protection
                  </CardTitle>
                  <CardDescription>
                    Exigences de protection pour les joueurs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eyeProtectionRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Protection oculaire</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Obligatoire pour tous les joueurs
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fullFaceProtectionRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Protection intégrale</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Obligatoire pour tous les joueurs (masque complet)
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-airsoft-red" />
                    Types de répliques
                  </CardTitle>
                  <CardDescription>
                    Définissez les types de répliques autorisés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="hpaAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">HPA</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="polarStarAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Polar Star</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tracersAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Traceurs</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-airsoft-red" />
                    Consommables
                  </CardTitle>
                  <CardDescription>
                    Définissez les consommables autorisés sur le terrain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="grenadesAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Grenades</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smokesAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Fumigènes</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pyroAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Pyrotechnie</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-airsoft-red" />
                    Paramètres & Limitations
                  </CardTitle>
                  <CardDescription>
                    Définissez les paramètres de votre partie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="maxPlayers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre maximum de joueurs</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              type="number" 
                              min="2"
                              className="w-full" 
                              {...field} 
                            />
                            <Users className="ml-2 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix par joueur (€)</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.5" 
                              className="w-full" 
                              {...field} 
                            />
                            <Euro className="ml-2 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-500 mt-1">Laissez 0 si l'entrée est gratuite</p>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="manualValidation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Validation manuelle</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Les demandes de participation doivent être validées manuellement
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requiresReplica"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Réplique requise</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Les joueurs doivent avoir leur propre réplique
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasToilets"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Toilettes</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Des toilettes sont disponibles sur le terrain
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasParking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Parking</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Un parking est disponible sur place
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasEquipmentRental"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Location de matériel</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Des répliques et équipements sont disponibles à la location
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Partie privée</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              La partie sera visible uniquement via un lien d'invitation
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-airsoft-red" />
                    Images
                  </CardTitle>
                  <CardDescription>
                    Ajoutez des photos du terrain (max. 5 images)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-airsoft-red transition-colors"
                    >
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-500">Cliquez pour sélectionner des images</span>
                    </label>
                  </div>
                  
                  {preview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                      {preview.map((src, index) => (
                        <div key={index} className="relative h-24 group">
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        J'accepte les conditions générales et je certifie que cette partie respecte les lois en vigueur
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/parties')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-airsoft-red hover:bg-red-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Créer la partie
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateParty;
