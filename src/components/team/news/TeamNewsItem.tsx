
import React from 'react';
import { TeamNews } from '@/types/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface TeamNewsItemProps {
  newsItem: TeamNews;
  isTeamAdmin: boolean;
  onEdit: (newsItem: TeamNews) => void;
  onDelete: (newsId: string) => void;
}

const TeamNewsItem: React.FC<TeamNewsItemProps> = ({ newsItem, isTeamAdmin, onEdit, onDelete }) => {
  const { author } = newsItem;
  const postDate = new Date(newsItem.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{newsItem.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={author?.avatar ?? undefined} alt={author?.username ?? 'Auteur'} />
                        <AvatarFallback>{author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{author?.username ?? 'Auteur inconnu'}</span>
                    <span>•</span>
                    <span>{postDate}</span>
                </div>
            </div>
            {isTeamAdmin && (
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(newsItem)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(newsItem.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="whitespace-pre-wrap">{newsItem.content}</p>
        {newsItem.images && newsItem.images.length > 0 && (
          <Carousel className="w-full max-w-full mt-4 -mx-1">
            <CarouselContent>
              {newsItem.images.map((image, index) => (
                <CarouselItem key={index} className="pl-2">
                  <div className="overflow-hidden rounded-lg">
                    <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto object-cover max-h-96" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {newsItem.images.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                </>
            )}
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamNewsItem;
