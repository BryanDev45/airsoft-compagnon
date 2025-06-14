
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
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!reason) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une raison",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Récupérer l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour signaler un utilisateur",
          variant: "destructive"
        });
        return;
      }

      // Insérer le signalement dans la base de données
      const { error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason: reason,
          details: details.trim() || null
        });

      if (error) {
        console.error('Erreur lors de l\'enregistrement du signalement:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer le signalement. Veuillez réessayer.",
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
      console.error('Erreur inattendue:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            Toutes les informations que vous fournissez resteront confidentielles. Notre équipe examinera votre signalement dans les plus brefs délais.
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReport}
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserButton;
