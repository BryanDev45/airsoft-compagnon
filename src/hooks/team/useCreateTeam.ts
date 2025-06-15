
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamSchema, TeamFormData } from '@/components/team/create/teamSchema';

export const useCreateTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      isAssociation: false,
      contact: user?.email || '',
      location: '',
    },
  });

  const onSubmit = async (data: TeamFormData) => {
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
      
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description || "",
          is_association: data.isAssociation,
          contact: data.contact || "",
          location: data.location || "",
          leader_id: user.id,
          member_count: 1,
          logo: defaultLogo,
          banner: defaultBanner,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (team) {
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'Admin',
            status: 'confirmed',
          });

        if (memberError) {
          console.error("Erreur lors de l'ajout du créateur comme membre:", memberError);
          toast({
            title: "Avertissement",
            description: "Votre équipe a été créée, mais une erreur est survenue lors de votre affectation en tant que membre. Vous devrez peut-être le faire manuellement.",
            variant: "default",
          });
        }
      }

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
  
  return { register, handleSubmit, setValue, errors, onSubmit, isSubmitting, navigate };
};
