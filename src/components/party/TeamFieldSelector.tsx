
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TeamField {
  id: string;
  name: string;
  address?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface TeamFieldSelectorProps {
  teamId: string;
  onFieldSelect: (field: TeamField) => void;
  selectedFieldId?: string;
}

const TeamFieldSelector: React.FC<TeamFieldSelectorProps> = ({
  teamId,
  onFieldSelect,
  selectedFieldId
}) => {
  const { data: teamFields, isLoading } = useQuery({
    queryKey: ['team-fields', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_fields')
        .select('*')
        .eq('team_id', teamId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!teamId
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500">Chargement des terrains...</div>;
  }

  if (!teamFields || teamFields.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Aucun terrain configuré pour votre équipe
      </div>
    );
  }

  const handleFieldSelect = (fieldId: string) => {
    const field = teamFields.find(f => f.id === fieldId);
    if (field) {
      onFieldSelect({
        id: field.id,
        name: field.name,
        address: field.address || '',
        coordinates: field.coordinates as { lat: number; lng: number }
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Terrain d'équipe
      </label>
      <Select value={selectedFieldId} onValueChange={handleFieldSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un terrain d'équipe" />
        </SelectTrigger>
        <SelectContent>
          {teamFields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <div>
                  <div className="font-medium">{field.name}</div>
                  {field.address && (
                    <div className="text-xs text-gray-500">{field.address}</div>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamFieldSelector;
