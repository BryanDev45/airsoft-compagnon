
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { TeamMember } from '@/types/team';

interface PendingMembersListProps {
  pendingMembers: TeamMember[];
  loading: boolean;
  handleAcceptMember: (memberId: string) => Promise<void>;
  handleRejectMember: (memberId: string) => Promise<void>;
}

const PendingMembersList = ({
  pendingMembers,
  loading,
  handleAcceptMember,
  handleRejectMember
}: PendingMembersListProps) => {
  if (pendingMembers.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Demandes d'adhésion en attente ({pendingMembers.length})</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membre</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={member.profiles?.avatar} 
                    alt={member.profiles?.username || "Utilisateur"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{member.profiles?.username || "Utilisateur"}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptMember(member.id)}
                    disabled={loading}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accepter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRejectMember(member.id)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Refuser
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingMembersList;
