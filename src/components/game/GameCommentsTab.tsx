
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash } from 'lucide-react';
import { useGameComments } from '@/hooks/useGameComments';
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { GameComment } from '@/types/game';

interface GameCommentsTabProps {
  gameId: string;
}

const GameCommentsTab: React.FC<GameCommentsTabProps> = ({ gameId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    comments,
    isLoading,
    newComment,
    setNewComment,
    addComment,
    deleteComment,
    formatCommentDate
  } = useGameComments(gameId);

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;
    
    setSubmitting(true);
    await addComment();
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Commentaires ({comments.length})</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-2 border-airsoft-red border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-6 mb-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun commentaire pour le moment. Soyez le premier à en laisser un !
            </p>
          ) : (
            comments.map((comment: GameComment) => (
              <div key={comment.id} className="flex gap-4">
                <img 
                  src={comment.profile?.avatar || '/placeholder.svg'} 
                  alt={comment.profile?.username || 'Utilisateur'} 
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{comment.profile?.username || 'Utilisateur'}</span>
                      <span className="text-xs text-gray-500 ml-2">{formatCommentDate(comment.created_at)}</span>
                    </div>
                    
                    {user && user.id === comment.user_id && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Supprimer le commentaire"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Ajouter un commentaire</h3>
        
        {!user ? (
          <div className="text-center p-4 bg-gray-50 rounded-md mb-3">
            <p className="mb-3">Connectez-vous pour laisser un commentaire</p>
            <Button 
              className="bg-airsoft-red hover:bg-red-700"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </Button>
          </div>
        ) : (
          <>
            <Textarea 
              className="w-full min-h-[100px] p-3 border rounded-md mb-3" 
              placeholder="Votre question ou commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
            />
            <Button 
              className="bg-airsoft-red hover:bg-red-700"
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Envoi en cours...
                </span>
              ) : (
                <>
                  <MessageSquare size={16} className="mr-2" />
                  Poster un commentaire
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default GameCommentsTab;
