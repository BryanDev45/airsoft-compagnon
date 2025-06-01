
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface TeamRatingProps {
  teamId: string;
  teamName: string;
  currentUserId?: string;
  isTeamMember: boolean;
  currentRating?: number;
  onRatingUpdate?: () => void;
}

const TeamRating: React.FC<TeamRatingProps> = ({
  teamId,
  teamName,
  currentUserId,
  isTeamMember,
  currentRating = 0,
  onRatingUpdate
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);

  // Vérifier si l'utilisateur a déjà noté cette équipe
  useEffect(() => {
    const checkExistingRating = async () => {
      if (!currentUserId || isTeamMember) return;
      
      try {
        const { data, error } = await supabase
          .from('team_ratings')
          .select('rating')
          .eq('rater_id', currentUserId)
          .eq('team_id', teamId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing rating:', error);
          return;
        }
        
        if (data) {
          setUserRating(data.rating);
          setHasRated(true);
        }
      } catch (error) {
        console.error('Error checking existing rating:', error);
      }
    };
    
    checkExistingRating();
  }, [currentUserId, teamId, isTeamMember]);

  const handleRatingClick = async (rating: number) => {
    if (!currentUserId || isTeamMember || isSaving) return;
    
    try {
      setIsSaving(true);
      
      if (hasRated) {
        // Mettre à jour la note existante
        const { error } = await supabase
          .from('team_ratings')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('rater_id', currentUserId)
          .eq('team_id', teamId);
          
        if (error) throw error;
      } else {
        // Créer une nouvelle note
        const { error } = await supabase
          .from('team_ratings')
          .insert({
            rater_id: currentUserId,
            team_id: teamId,
            rating
          });
          
        if (error) throw error;
        setHasRated(true);
      }
      
      setUserRating(rating);
      
      // Mettre à jour la note moyenne de l'équipe
      const { data: ratings, error: avgError } = await supabase
        .from('team_ratings')
        .select('rating')
        .eq('team_id', teamId);
        
      if (avgError) throw avgError;
      
      if (ratings && ratings.length > 0) {
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        const { error: updateError } = await supabase
          .from('teams')
          .update({ rating: avgRating })
          .eq('id', teamId);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: "Note enregistrée",
        description: `Vous avez noté ${teamName} : ${rating}/5 étoiles`
      });
      
      if (onRatingUpdate) {
        onRatingUpdate();
      }
      
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre note",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Ne pas afficher le composant si l'utilisateur est membre de l'équipe ou non connecté
  if (isTeamMember || !currentUserId) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Noter cette équipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-transparent"
              onMouseEnter={() => !isSaving && setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRatingClick(star)}
              disabled={isSaving}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoverRating || userRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </Button>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {userRating > 0 ? (
              <>Votre note : {userRating}/5 {hasRated ? '(modifiable)' : ''}</>
            ) : (
              'Cliquez sur les étoiles pour noter'
            )}
          </p>
          {currentRating > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Note moyenne : {currentRating.toFixed(1)}/5
            </p>
          )}
        </div>
        
        {isSaving && (
          <p className="text-center text-sm text-gray-500 animate-pulse">
            Enregistrement...
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamRating;
