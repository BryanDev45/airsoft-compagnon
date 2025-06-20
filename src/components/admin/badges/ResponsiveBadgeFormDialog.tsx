
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge as BadgeType } from '@/hooks/badges/useAllBadges';
import { Upload, Image, Lock } from 'lucide-react';

interface ResponsiveBadgeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  badge?: BadgeType | null;
  isSaving: boolean;
}

const ResponsiveBadgeFormDialog: React.FC<ResponsiveBadgeFormDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  badge,
  isSaving
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_hidden: false,
    iconFile: null as File | null,
    lockedIconFile: null as File | null
  });

  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [lockedIconPreview, setLockedIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (badge) {
      setFormData({
        name: badge.name,
        description: badge.description || '',
        is_hidden: badge.is_hidden || false,
        iconFile: null,
        lockedIconFile: null
      });
      setIconPreview(badge.icon);
      setLockedIconPreview(badge.locked_icon || null);
    } else {
      setFormData({
        name: '',
        description: '',
        is_hidden: false,
        iconFile: null,
        lockedIconFile: null
      });
      setIconPreview(null);
      setLockedIconPreview(null);
    }
  }, [badge]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'iconFile' | 'lockedIconFile', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'iconFile') {
          setIconPreview(e.target?.result as string);
        } else {
          setLockedIconPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (field === 'iconFile') {
        setIconPreview(badge?.icon || null);
      } else {
        setLockedIconPreview(badge?.locked_icon || null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[600px] flex flex-col p-3 sm:p-6">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {badge ? 'Modifier le badge' : 'Créer un nouveau badge'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Informations de base */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Nom du badge *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Nom du badge"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 min-h-[80px] resize-none"
                  placeholder="Description du badge"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Badge masqué</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Les badges masqués n'apparaissent pas publiquement
                  </p>
                </div>
                <Switch
                  checked={formData.is_hidden}
                  onCheckedChange={(checked) => handleInputChange('is_hidden', checked)}
                />
              </div>
            </div>

            {/* Icônes - Onglets responsive */}
            <Tabs defaultValue="icon" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="icon" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                  <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Icône débloqué</span>
                  <span className="sm:hidden">Débloqué</span>
                </TabsTrigger>
                <TabsTrigger value="locked" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Icône verrouillé</span>
                  <span className="sm:hidden">Verrouillé</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="icon" className="space-y-3 sm:space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Icône débloqué *</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Image affichée quand le badge est obtenu
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {iconPreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={iconPreview}
                          alt="Aperçu"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 w-full sm:w-auto">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('iconFile', e.target.files?.[0] || null)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format recommandé : PNG, JPG (max 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="locked" className="space-y-3 sm:space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Icône verrouillé (optionnel)</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Image affichée quand le badge n'est pas encore obtenu
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {lockedIconPreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={lockedIconPreview}
                          alt="Aperçu verrouillé"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 w-full sm:w-auto">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('lockedIconFile', e.target.files?.[0] || null)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format recommandé : PNG, JPG (max 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>

        {/* Actions - Toujours visible en bas */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
            disabled={isSaving}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving || !formData.name}
            className="flex-1 sm:flex-none"
          >
            {isSaving ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              badge ? 'Modifier' : 'Créer'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveBadgeFormDialog;
