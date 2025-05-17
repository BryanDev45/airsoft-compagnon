
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { UserMinus, LogOut } from "lucide-react";
import { TeamMember } from '@/types/team';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  loading: boolean;
  isTeamLeader: boolean;
  teamLeaderId?: string;
  currentUserId?: string;
  handleRemoveMember: (memberId: string) => Promise<void>;
  handleUpdateMemberRole: (memberId: string, newRole: string) => Promise<void>;
  handleLeaveTeam: () => Promise<void>;
}

const TeamMembersList = ({
  teamMembers,
  loading,
  isTeamLeader,
  teamLeaderId,
  currentUserId,
  handleRemoveMember,
  handleUpdateMemberRole,
  handleLeaveTeam
}: TeamMembersListProps) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Membres de l'équipe ({teamMembers.length})</h3>
      {teamMembers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membre</TableHead>
              {isTeamLeader && <TableHead>Rôle</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={member.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.profiles?.username || 'user'}`}
                      alt={member.profiles?.username || "Utilisateur"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{member.profiles?.username || "Utilisateur"}</span>
                  {member.user_id === teamLeaderId && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                      Leader
                    </span>
                  )}
                </TableCell>
                
                {isTeamLeader && (
                  <TableCell>
                    {member.user_id !== teamLeaderId && (
                      <ToggleGroup 
                        type="single" 
                        value={member.role || "Membre"}
                        onValueChange={(value) => {
                          if (value) handleUpdateMemberRole(member.id, value);
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="Membre" size="sm">Membre</ToggleGroupItem>
                        <ToggleGroupItem value="Modérateur" size="sm">Modérateur</ToggleGroupItem>
                        <ToggleGroupItem value="Admin" size="sm">Admin</ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  </TableCell>
                )}
                
                <TableCell>
                  {isTeamLeader && member.user_id !== teamLeaderId && member.user_id !== currentUserId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading}
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  )}
                  
                  {!isTeamLeader && member.user_id === currentUserId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLeaveTeam}
                      disabled={loading}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Quitter
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500 text-center py-4">Aucun membre confirmé dans l'équipe</p>
      )}
    </div>
  );
};

export default TeamMembersList;
