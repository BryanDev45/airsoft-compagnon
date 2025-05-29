
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit } from 'lucide-react';
import { Partner } from '@/hooks/usePartners';

interface PartnerDialogProps {
  partner?: Partner;
  onSave: (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  trigger?: React.ReactNode;
}

const categories = ['Équipement', 'Terrain', 'Service', 'Événement', 'Média', 'Magasin'];

const PartnerDialog: React.FC<PartnerDialogProps> = ({ partner, onSave, trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    website: '',
    category: ''
  });

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || '',
        logo: partner.logo || '',
        description: partner.description || '',
        website: partner.website || '',
        category: partner.category || ''
      });
    } else {
      setFormData({
        name: '',
        logo: '',
        description: '',
        website: '',
        category: ''
      });
    }
  }, [partner, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;
    
    onSave(formData);
    setOpen(false);
  };

  const defaultTrigger = partner ? (
    <Button variant="outline" size="sm">
      <Edit size={16} className="mr-2" />
      Modifier
    </Button>
  ) : (
    <Button>
      <Plus size={16} className="mr-2" />
      Ajouter un partenaire
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {partner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="logo">URL du logo</Label>
            <Input
              id="logo"
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {partner ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerDialog;
