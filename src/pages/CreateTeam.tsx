
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComboboxDemo } from '@/components/profile/CityCombobox';

const teamSchema = z.object({
  name: z.string().min(3, { message: "Le nom de l'équipe doit contenir au moins 3 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  isAssociation: z.boolean().optional(),
  contact: z.string().email({ message: "Email de contact invalide" }).optional(),
});

const CreateTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      isAssociation: false,
      contact: user?.email || '',
    },
  });

  // Make sure we handle the location properly and never pass undefined
  const onLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation || ""); // Ensure we never set undefined
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une équipe",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Créer l'équipe dans Supabase
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description,
          is_association: data.isAssociation,
          contact: data.contact,
          location: location || "", // Ensure we never insert undefined
          leader_id: user.id,
          member_count: 1,
          logo: "/placeholder.svg", // Logo par défaut
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Ajouter le créateur comme membre et leader de l'équipe
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'Leader',
        });
      
      if (memberError) throw memberError;
      
      // Mettre à jour le profil de l'utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          team_id: team.id,
          team: data.name,
          is_team_leader: true
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      toast({
        title: "Succès",
        description: "Votre équipe a été créée avec succès",
      });
      
      navigate(`/team/${team.id}`);
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'équipe. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Créer une équipe</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l'équipe</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message?.toString()}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    className={errors.description ? "border-red-500" : ""}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description.message?.toString()}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <ComboboxDemo onSelect={onLocationSelect} />
                </div>
                
                <div>
                  <Label htmlFor="contact">Email de contact</Label>
                  <Input
                    id="contact"
                    type="email"
                    {...register('contact')}
                    className={errors.contact ? "border-red-500" : ""}
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
              
              <div className="pt-4 flex justify-end space-x-3">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;
