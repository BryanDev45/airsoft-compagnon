
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
  city?: string;
  zip_code?: string;
  coordinates: number[] | { lat: number; lng: number };
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
      
      // Parse the address to extract city and zip code if not already separated
      return (data || []).map(field => {
        let parsedCity = '';
        let parsedZipCode = '';
        let cleanAddress = field.address || '';
        
        if (field.address) {
          // Try to extract city and zip code from address
          // Look for patterns like "75001 Paris" or "Paris 75001"
          const zipPattern = /\b(\d{5})\b/;
          const zipMatch = field.address.match(zipPattern);
          
          if (zipMatch) {
            parsedZipCode = zipMatch[1];
            // Remove zip code from address and clean up
            cleanAddress = field.address.replace(zipPattern, '').replace(/,\s*$/, '').trim();
            
            // The remaining part after removing zip code should be the city
            const parts = cleanAddress.split(',').map(part => part.trim()).filter(Boolean);
            if (parts.length > 0) {
              // Take the last non-empty part as city
              parsedCity = parts[parts.length - 1];
              // Remove city from address
              cleanAddress = parts.slice(0, -1).join(', ');
            }
          }
        }
        
        return {
          ...field,
          address: cleanAddress,
          city: parsedCity,
          zip_code: parsedZipCode,
          coordinates: field.coordinates as number[] | { lat: number; lng: number }
        };
      });
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
      onFieldSelect(field);
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
                    <div className="text-xs text-gray-500">
                      {field.address}
                      {field.city && `, ${field.city}`}
                      {field.zip_code && ` ${field.zip_code}`}
                    </div>
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
