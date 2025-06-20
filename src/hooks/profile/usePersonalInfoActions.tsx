
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

interface UsePersonalInfoActionsProps {
  user: any;
}

export const usePersonalInfoActions = ({ user }: UsePersonalInfoActionsProps) => {
  const updateFirstName = async (firstName: string) => {
    try {
      console.log('Updating first name:', firstName, 'for user:', user?.id);
      const { error } = await supabase
        .from('profiles')
        .update({ firstname: firstName })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase error updating first name:', error);
        throw error;
      }

      console.log('First name updated successfully');
      toast({
        title: "Succès",
        description: "Prénom mis à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating first name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prénom",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateLastName = async (lastName: string) => {
    try {
      console.log('Updating last name:', lastName, 'for user:', user?.id);
      const { error } = await supabase
        .from('profiles')
        .update({ lastname: lastName })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase error updating last name:', error);
        throw error;
      }

      console.log('Last name updated successfully');
      toast({
        title: "Succès",
        description: "Nom mis à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating last name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nom",
        variant: "destructive"
      });
      return false;
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    try {
      console.log('Updating phone number:', phoneNumber, 'for user:', user?.id);
      const { error } = await supabase
        .from('profiles')
        .update({ phone_number: phoneNumber })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase error updating phone:', error);
        throw error;
      }

      console.log('Phone number updated successfully');
      toast({
        title: "Succès",
        description: "Numéro de téléphone mis à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le numéro de téléphone",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateSpokenLanguage = async (language: string) => {
    try {
      console.log('Updating spoken language:', language, 'for user:', user?.id);
      const { error } = await supabase
        .from('profiles')
        .update({ spoken_language: language })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase error updating language:', error);
        throw error;
      }

      console.log('Spoken language updated successfully');
      toast({
        title: "Succès",
        description: "Langue parlée mise à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating spoken language:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la langue parlée",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    updateFirstName,
    updateLastName,
    updatePhoneNumber,
    updateSpokenLanguage
  };
};
