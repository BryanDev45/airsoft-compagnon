
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import AddStoreDialog from '../stores/AddStoreDialog';
import { supabase } from '@/integrations/supabase/client';

interface AdminStoreSectionProps {
  user: any;
}

const AdminStoreSection: React.FC<AdminStoreSectionProps> = ({ user }) => {
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profileData?.Admin === true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button 
          onClick={() => setIsAddStoreDialogOpen(true)} 
          className="bg-airsoft-red hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un magasin
        </Button>
      </div>
      
      <AddStoreDialog 
        open={isAddStoreDialogOpen} 
        onOpenChange={setIsAddStoreDialogOpen} 
      />
    </>
  );
};

export default AdminStoreSection;
