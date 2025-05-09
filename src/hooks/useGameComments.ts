
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { GameComment } from '@/types/game';
import { Profile } from '@/types/profile';

export const useGameComments = (gameId: string) => {
  const [comments, setComments] = useState<GameComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      
      // Modification de la requête pour éviter l'erreur de relation
      const { data: commentsData, error: commentsError } = await supabase
        .from('game_comments')
        .select(`
          id,
          user_id,
          game_id,
          content,
          created_at
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Récupérer les profils pour chaque commentaire
      const commentsWithProfiles = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, avatar')
            .eq('id', comment.user_id)
            .single();
          
          return {
            ...comment,
            profile: profileError ? null : (profileData as Profile)
          } as GameComment;
        })
      );
      
      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commentaires."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchComments();
    }
  }, [gameId]);

  const addComment = async () => {
    if (!user || !newComment.trim()) return;
    
    try {
      const { error } = await supabase
        .from('game_comments')
        .insert({
          game_id: gameId,
          user_id: user.id,
          content: newComment.trim()
        });
      
      if (error) throw error;
      
      setNewComment('');
      fetchComments(); // Refresh comments
      
      toast({
        title: "Commentaire publié",
        description: "Votre commentaire a été ajouté avec succès."
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de publier votre commentaire."
      });
    }
  };
  
  const deleteComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('game_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Commentaire supprimé",
        description: "Votre commentaire a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer votre commentaire."
      });
    }
  };
  
  const formatCommentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffInHours < 24) {
        return format(date, 'HH:mm', { locale: fr });
      } else if (diffInHours < 48) {
        return 'Hier';
      } else {
        return format(date, 'dd MMM yyyy', { locale: fr });
      }
    } catch (error) {
      return dateString;
    }
  };

  return {
    comments,
    isLoading,
    newComment,
    setNewComment,
    addComment,
    deleteComment,
    formatCommentDate
  };
};
