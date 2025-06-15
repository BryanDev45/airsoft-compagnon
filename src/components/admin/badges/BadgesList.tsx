
import React from 'react';
import { Badge as BadgeType } from '@/hooks/badges/useAllBadges';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';

interface BadgesListProps {
  badges: BadgeType[];
  onEdit: (badge: BadgeType) => void;
  onDelete: (badge: BadgeType) => void;
}

const BadgesList: React.FC<BadgesListProps> = ({ badges, onEdit, onDelete }) => {
  if (badges.length === 0) {
    return <p className="text-center text-gray-500 py-8">Aucun badge trouvé.</p>;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Icônes</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-40">Couleurs</TableHead>
            <TableHead className="text-right w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badges.map((badge) => (
            <TableRow key={badge.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img src={badge.icon} alt={badge.name} title="Débloqué" className="w-12 h-12 object-contain rounded-full border" />
                  {badge.locked_icon ? (
                    <img src={badge.locked_icon} alt={`${badge.name} (verrouillé)`} title="Verrouillé" className="w-12 h-12 object-contain rounded-full border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full border bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center">Aucune</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{badge.name}</TableCell>
              <TableCell className="text-sm text-gray-600">{badge.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div title={`Fond: ${badge.background_color}`} className="w-5 h-5 rounded-full border" style={{ backgroundColor: badge.background_color }}></div>
                  <div title={`Bordure: ${badge.border_color}`} className="w-5 h-5 rounded-full border" style={{ backgroundColor: badge.border_color }}></div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(badge)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => onDelete(badge)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BadgesList;
