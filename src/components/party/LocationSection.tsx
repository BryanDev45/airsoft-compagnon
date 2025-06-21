
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Users } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { LocationSectionProps } from '@/types/party';
import { useAuth } from '@/hooks/useAuth';
import TeamFieldSelector from './TeamFieldSelector';
import CoordinatesInput from './CoordinatesInput';

const LocationSection: React.FC<LocationSectionProps> = ({ updateFormData, initialData }) => {
  const form = useFormContext();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'address' | 'coordinates' | 'team-field'>('address');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  
  useEffect(() => {
    if (initialData && updateFormData) {
      updateFormData('location', {
        address: initialData.address,
        city: initialData.city,
        zipCode: initialData.zip_code,
        latitude: initialData.latitude,
        longitude: initialData.longitude
      });
    }
  }, [initialData, updateFormData]);

  const handleTeamFieldSelect = (field: any) => {
    // Mettre à jour l'état de sélection
    setSelectedFieldId(field.id);
    
    // Remplir les champs du formulaire avec les données du terrain
    form.setValue('address', field.address || '');
    form.setValue('city', field.address ? field.address.split(',').pop()?.trim() || '' : '');
    form.setValue('zipCode', '');
    form.setValue('latitude', field.coordinates.lat);
    form.setValue('longitude', field.coordinates.lng);
  };

  const clearLocationFields = () => {
    form.setValue('address', '');
    form.setValue('city', '');
    form.setValue('zipCode', '');
    form.setValue('latitude', '');
    form.setValue('longitude', '');
    // Réinitialiser aussi la sélection du terrain
    setSelectedFieldId('');
  };

  // Réinitialiser la sélection quand on change d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
    if (value !== 'team-field') {
      setSelectedFieldId('');
    }
  };

  const hasTeam = user?.team_id;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-airsoft-red" />
          Lieu
        </CardTitle>
        <CardDescription>
          Indiquez le lieu où se déroule la partie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </TabsTrigger>
            <TabsTrigger value="coordinates" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Coordonnées
            </TabsTrigger>
            {hasTeam && (
              <TabsTrigger value="team-field" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Terrain équipe
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="address" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="coordinates" className="space-y-4 mt-4">
            <div className="text-sm text-gray-600 mb-4">
              Saisissez directement les coordonnées géographiques du lieu
            </div>
            <CoordinatesInput />
          </TabsContent>

          {hasTeam && (
            <TabsContent value="team-field" className="space-y-4 mt-4">
              <TeamFieldSelector 
                teamId={user.team_id}
                onFieldSelect={handleTeamFieldSelect}
                selectedFieldId={selectedFieldId}
              />
              <div className="text-xs text-gray-500">
                Les informations du terrain sélectionné seront automatiquement remplies
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
