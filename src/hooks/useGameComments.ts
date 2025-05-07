
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GameComment } from '@/types/game';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const useGameComments = (gameId: string | undefined) => {
  const [comments, setComments] = useState<GameComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!gameId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('game_comments')
        .select(`
          *,
          profile:user_id (id, username, avatar)
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transformer les données pour s'assurer qu'elles correspondent au type GameComment[]
      const formattedComments = (data || []).map(item => {
        // Si profile a une erreur (relation non trouvée), définir profile à null
        if (item.profile && typeof item.profile === 'object' && 'error' in item.profile) {
          return {
            ...item,
            profile: null
          } as GameComment;
        }
        return item as GameComment;
      });
      
      setComments(formattedComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commentaires"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async () => {
    if (!gameId || !newComment.trim()) return;
    
    try {
      const { error } = await supabase
        .from('game_comments')
        .insert({
          game_id: gameId,
          content: newComment.trim(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié"
      });
      
      setNewComment('');
      fetchComments();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le commentaire"
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('game_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      toast({
        title: "Commentaire supprimé",
        description: "Votre commentaire a été supprimé"
      });
      
      fetchComments();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le commentaire"
      });
    }
  };

  const formatCommentDate = (dateString: string) => {
    try {
      return `Il y a ${formatDistanceToNow(new Date(dateString), { addSuffix: false, locale: fr })}`;
    } catch (error) {
      return dateString;
    }
  };

  // Charger les commentaires au montage du composant
  useEffect(() => {
    fetchComments();

    // Configurer un canal de souscription pour les mises à jour en temps réel
    if (gameId) {
      const channel = supabase
        .channel(`game_comments_${gameId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'game_comments',
          filter: `game_id=eq.${gameId}`
        }, () => {
          fetchComments();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [gameId]);

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
