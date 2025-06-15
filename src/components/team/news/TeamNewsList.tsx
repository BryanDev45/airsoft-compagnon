
import React from 'react';
import { TeamNews } from '@/types/team';
import TeamNewsItem from './TeamNewsItem';

interface TeamNewsListProps {
  news: TeamNews[];
  isTeamAdmin: boolean;
  onEdit: (newsItem: TeamNews) => void;
  onDelete: (newsId: string) => void;
}

const TeamNewsList: React.FC<TeamNewsListProps> = ({ news, isTeamAdmin, onEdit, onDelete }) => {
  if (news.length === 0) {
    return <div className="text-center text-gray-500 py-8">Aucune actualité pour le moment.</div>;
  }

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <TeamNewsItem 
          key={item.id} 
          newsItem={item} 
          isTeamAdmin={isTeamAdmin} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default TeamNewsList;
