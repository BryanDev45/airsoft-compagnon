import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
interface TeamMember {
  id: string;
  username?: string;
  role?: string;
  avatar?: string;
  joinedTeam?: string;
  verified?: boolean;
  game_role?: string;
  isTeamLeader?: boolean;
  status?: string; // Ajout du statut pour filtrer les membres
  association_role?: string;
}
interface TeamMembersProps {
  members: TeamMember[];
  handleViewMember: (member: TeamMember) => void;
  isAssociation?: boolean;
}
const TeamMembers = ({
  members,
  handleViewMember,
  isAssociation
}: TeamMembersProps) => {
  // Filtrer pour ne garder que les membres confirmés ou sans statut explicite
  const confirmedMembers = members.filter(member => member.status === undefined || member.status === 'confirmed');

  // Tri des membres pour que le team leader apparaisse en premier
  const sortedMembers = [...confirmedMembers].sort((a, b) => {
    if (a.isTeamLeader && !b.isTeamLeader) return -1;
    if (!a.isTeamLeader && b.isTeamLeader) return 1;
    return 0;
  });
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedMembers.map((member: TeamMember) => <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-start p-4">
              <div className="relative">
                <img src={member.avatar} alt={member.username} className="w-16 h-16 rounded-full object-cover" />
                {member.isTeamLeader && <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    
                  </div>}
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center">
                  <h3 className="font-semibold">{member.username}</h3>
                  {member.verified && <img src="/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png" alt="Vérifié" className="w-5 h-5 ml-1" />}
                </div>
                <p className="text-sm text-gray-500">{member.role}</p>
                <p className="text-xs text-gray-400 mt-1">Membre depuis {member.joinedTeam}</p>
              </div>
              <Button variant="outline" size="sm" className="text-airsoft-red border-airsoft-red hover:bg-airsoft-red hover:text-white" onClick={() => handleViewMember(member)}>
                Profil
              </Button>
            </div>
            <div className="bg-gray-50 px-4 py-2 border-t">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Rôle en jeu:</span> {member.game_role || 'Non spécifié'}
              </p>
              {isAssociation && <p className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Rôle dans l'association:</span> {member.association_role || 'Non spécifié'}
                </p>}
            </div>
          </CardContent>
        </Card>)}
    </div>;
};
export default TeamMembers;