
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const teamSchema = z.object({
  name: z.string().min(3, { message: "Le nom de l'équipe doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  isAssociation: z.boolean().optional(),
  contact: z.string().email({ message: "Email de contact invalide" }).optional(),
});

const CreateTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState<string>("");
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
      
      const defaultLogo = "/placeholder.svg";
      const defaultBanner = "https://images.unsplash.com/photo-1553302948-2b3ec6d9eada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=300&q=80";
      
      // Create team
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description || "",
          is_association: data.isAssociation,
          contact: data.contact || "",
          location: location || "",
          leader_id: user.id,
          member_count: 1,
          logo: defaultLogo,
          banner: defaultBanner,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Votre équipe a été créée avec succès"
      });
      
      navigate(`/team/${team.id}`);
    } catch (error: any) {
      console.error("Erreur lors de la création de l'équipe:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'équipe. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg border-t-4 border-airsoft-red">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center">Créer une équipe</CardTitle>
              <CardDescription className="text-center">
                Remplissez le formulaire ci-dessous pour créer votre équipe
              </CardDescription>
            </CardHeader>
            
            <CardContent>
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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;
