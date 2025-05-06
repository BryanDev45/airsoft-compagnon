
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';

interface Comment {
  author: string;
  avatar: string;
  date: string;
  content: string;
}

interface GameCommentsTabProps {
  comments: Comment[];
}

const GameCommentsTab: React.FC<GameCommentsTabProps> = ({ comments }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Commentaires ({comments.length})</h2>
      
      <div className="space-y-6 mb-6">
        {comments.map((comment, idx) => (
          <div key={idx} className="flex gap-4">
            <img 
              src={comment.avatar} 
              alt={comment.author} 
              className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Ajouter un commentaire</h3>
        <textarea 
          className="w-full min-h-[100px] p-3 border rounded-md mb-3" 
          placeholder="Votre question ou commentaire..."
        ></textarea>
        <Button className="bg-airsoft-red hover:bg-red-700">
          <MessageSquare size={16} className="mr-2" />
          Poster un commentaire
        </Button>
      </div>
    </>
  );
};

export default GameCommentsTab;
