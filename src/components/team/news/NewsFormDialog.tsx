
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TeamNews, TeamNewsFormData } from '@/types/team';
import { UseMutationResult } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';

const newsSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères."),
  content: z.string().min(10, "Le contenu doit faire au moins 10 caractères."),
  images: z.instanceof(FileList).optional(),
});

interface NewsFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newsItem: TeamNews | null;
  createNews: UseMutationResult<any, Error, TeamNewsFormData, unknown>;
  updateNews: UseMutationResult<any, Error, TeamNewsFormData & { id: string }, unknown>;
}

const NewsFormDialog: React.FC<NewsFormDialogProps> = ({
  isOpen,
  onOpenChange,
  newsItem,
  createNews,
  updateNews,
}) => {
  const isEditing = !!newsItem;
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Omit<TeamNewsFormData, 'existingImages'>>({
    resolver: zodResolver(newsSchema),
  });

  const newImages = watch('images');

  useEffect(() => {
    if (isOpen) {
        if (newsItem) {
            reset({ title: newsItem.title, content: newsItem.content });
            setExistingImages(newsItem.images || []);
        } else {
            reset({ title: '', content: '', images: undefined });
            setExistingImages([]);
        }
    }
  }, [newsItem, reset, isOpen]);
  
  useEffect(() => {
    if (newImages && newImages.length > 0) {
      const urls = Array.from(newImages).map(file => URL.createObjectURL(file));
      setImagePreviews(urls);
      
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    }
    setImagePreviews([]);
  }, [newImages]);

  const onSubmit = async (data: Omit<TeamNewsFormData, 'existingImages'>) => {
    const mutation = isEditing ? updateNews : createNews;
    const payload = isEditing ? { ...data, id: newsItem!.id, existingImages } : data;
    
    await mutation.mutateAsync(payload as any);
    onOpenChange(false);
  };
  
  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  };
  
  const totalImages = existingImages.length + (newImages?.length || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier l'actualité" : "Créer une actualité"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea id="content" {...register('content')} rows={10} />
            {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <Label htmlFor="images">Images (10 max)</Label>
            <Input 
              id="images" 
              type="file" 
              multiple 
              accept="image/*"
              {...register('images')} 
              disabled={totalImages >= 10}
            />
             {totalImages >= 10 && <p className="text-yellow-600 text-sm mt-1">Nombre maximum d'images atteint.</p>}
          </div>

          {(existingImages.length > 0 || imagePreviews.length > 0) && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {existingImages.map(img => (
                <div key={img} className="relative group">
                  <img src={img} alt="Aperçu existant" className="w-full h-24 object-cover rounded" />
                  <button type="button" onClick={() => handleRemoveExistingImage(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.map((preview, index) => (
                 <div key={index} className="relative">
                  <img src={preview} alt="Aperçu nouveau" className="w-full h-24 object-cover rounded" />
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {(isSubmitting || mutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsFormDialog;
