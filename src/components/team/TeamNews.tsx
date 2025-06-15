
import React, { useState } from 'react';
import { useTeamNews } from '@/hooks/team/useTeamNews';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import NewsFormDialog from './news/NewsFormDialog';
import TeamNewsList from './news/TeamNewsList';
import { TeamNews as TeamNewsType } from '@/types/team';
import { Card, CardContent } from '../ui/card';

interface TeamNewsProps {
  teamId: string;
  isTeamAdmin: boolean;
}

const TeamNews: React.FC<TeamNewsProps> = ({ teamId, isTeamAdmin }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<TeamNewsType | null>(null);
  
  const { 
    newsQuery, 
    createNewsMutation, 
    updateNewsMutation, 
    deleteNewsMutation 
  } = useTeamNews(teamId);

  const { data: news, isLoading, error } = newsQuery;

  const handleCreate = () => {
    setSelectedNews(null);
    setIsFormOpen(true);
  };

  const handleEdit = (newsItem: TeamNewsType) => {
    setSelectedNews(newsItem);
    setIsFormOpen(true);
  };

  const handleDelete = (newsId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      deleteNewsMutation.mutate(newsId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
      </div>
    );
  }

  if (error) {
    return <Card><CardContent className="p-4 text-destructive">{error.message}</CardContent></Card>;
  }

  return (
    <div>
      {isTeamAdmin && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une actualité
          </Button>
        </div>
      )}
      
      <TeamNewsList 
        news={news || []} 
        isTeamAdmin={isTeamAdmin} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      {isTeamAdmin && (
        <NewsFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          newsItem={selectedNews}
          createNews={createNewsMutation}
          updateNews={updateNewsMutation}
        />
      )}
    </div>
  );
};

export default TeamNews;
