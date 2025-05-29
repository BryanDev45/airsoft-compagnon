
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.Admin === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add partner
  const addPartner = async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user || !isAdmin) {
      toast({
        title: "Erreur",
        description: "Accès non autorisé",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('partners')
        .insert([{
          ...partnerData,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Partenaire ajouté avec succès"
      });
      
      fetchPartners();
    } catch (error) {
      console.error('Error adding partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le partenaire",
        variant: "destructive"
      });
    }
  };

  // Update partner
  const updatePartner = async (id: string, partnerData: Partial<Partner>) => {
    if (!user || !isAdmin) {
      toast({
        title: "Erreur",
        description: "Accès non autorisé",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('partners')
        .update({
          ...partnerData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Partenaire modifié avec succès"
      });
      
      fetchPartners();
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le partenaire",
        variant: "destructive"
      });
    }
  };

  // Delete partner
  const deletePartner = async (id: string) => {
    if (!user || !isAdmin) {
      toast({
        title: "Erreur",
        description: "Accès non autorisé",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Partenaire supprimé avec succès"
      });
      
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    isAdmin,
    addPartner,
    updatePartner,
    deletePartner,
    refetch: fetchPartners
  };
};
