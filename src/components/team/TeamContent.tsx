
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamMembers from './TeamMembers';
import TeamGames from './TeamGames';
import TeamField from './TeamField';
import { supabase } from '@/integrations/supabase/client';

interface TeamContentProps {
  team: any;
  isTeamMember: boolean;
  handleViewMember: (member: any) => void;
  isEditingField: boolean;
  setIsEditingField: (value: boolean) => void;
  selectedField: any;
  setSelectedField: (field: any) => void;
  fetchTeamData: () => void;
  handleFieldEdit: (fieldId: string | null, updates: any) => void;
}

const TeamContent: React.FC<TeamContentProps> = ({ 
  team,
  isTeamMember,
  handleViewMember,
  isEditingField,
  setIsEditingField,
  selectedField,
  setSelectedField,
  fetchTeamData,
  handleFieldEdit
}) => {
  return (
    <div className="md:w-2/3">
      <Tabs defaultValue="members">
        <TabsList className="mb-6">
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="games">Parties</TabsTrigger>
          <TabsTrigger value="field">Terrain</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <TeamMembers members={team.members} handleViewMember={handleViewMember} />
        </TabsContent>

        <TabsContent value="games">
          <TeamGames upcomingGames={team.upcomingGames} pastGames={team.pastGames} />
        </TabsContent>

        <TabsContent value="field">
          <TeamField 
            field={team.field}
            isEditing={isEditingField}
            onEdit={(fieldId, updates) => {
              setSelectedField(updates);
              setIsEditingField(true);
            }}
            onSave={(fieldId, updates) => handleFieldEdit(fieldId, updates)}
            onCancel={() => {
              setIsEditingField(false);
              setSelectedField(null);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamContent;
