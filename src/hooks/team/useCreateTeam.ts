
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
      
      const { data: teamId, error } = await supabase.rpc('create_team_with_leader', {
        team_name: data.name,
        team_description: data.description,
        team_is_association: data.isAssociation,
        team_contact: data.contact,
        team_location: data.location,
      });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Votre équipe a été créée avec succès"
      });
      
      if (teamId) {
        navigate(`/team/${teamId}`);
      } else {
        console.error("La création de l'équipe a réussi mais l'ID de l'équipe n'a pas été retourné.");
        navigate('/'); // Fallback navigation
      }
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
