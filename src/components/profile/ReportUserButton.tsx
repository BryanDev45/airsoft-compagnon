
import React, { useState } from 'react';
import { UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReportUserButtonProps {
  username: string;
  reportedUserId: string;
}

const ReportUserButton = ({ username, reportedUserId }: ReportUserButtonProps) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    if (!reason) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une raison",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour signaler un utilisateur",
          variant: "destructive"
        });
        return;
      }

      // Insert the report into the database
      const { error: insertError } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason: reason,
          details: details || null,
          status: 'pending'
        });

      if (insertError) {
        console.error('Error inserting report:', insertError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du signalement",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Signalement envoyé",
        description: "Merci pour votre signalement. Notre équipe va l'examiner."
      });
      
      setReason("");
      setDetails("");
      setOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du signalement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <UserX className="mr-2 h-4 w-4" />
          Signaler
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Signaler {username}</DialogTitle>
          <DialogDescription>
            Si vous pensez que cet utilisateur enfreint les règles de la communauté, veuillez le signaler.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du signalement</Label>
            <Select 
              value={reason}
              onValueChange={setReason}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Sélectionner une raison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                <SelectItem value="harassment">Harcèlement</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="fake">Faux profil</SelectItem>
                <SelectItem value="other">Autre raison</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Détails</Label>
            <Textarea 
              id="details"
              placeholder="Veuillez fournir plus de détails sur votre signalement..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            Toutes les informations que vous fournissez resteront confidentielles. Notre équipe examinera votre signalement dans les plus brefs délais.
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReport} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserButton;
