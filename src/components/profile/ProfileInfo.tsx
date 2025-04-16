
import React, { useState } from 'react';
import { User, MapPin, Calendar, Edit, Save, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileInfoProps {
  user: any;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}

const ProfileInfo = ({ user, editing, setEditing }: ProfileInfoProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Informations visibles aux autres joueurs et organisateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            {editing ? (
              <textarea 
                className="w-full min-h-[100px] p-3 border rounded-md"
                defaultValue={user.bio}
              ></textarea>
            ) : (
              <p className="text-gray-700">{user.bio}</p>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} />
                Nom d'utilisateur
              </label>
              {editing ? (
                <Input defaultValue={user.username} />
              ) : (
                <p className="text-gray-700 flex items-center">
                  {user.username}
                  {user.isVerified && (
                    <img 
                      src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png"
                      alt="Vérifié"
                      className="w-4 h-4 ml-1"
                      title="Profil vérifié"
                    />
                  )}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} />
                Nom
              </label>
              {editing ? (
                <Input defaultValue={user.lastname} />
              ) : (
                <p className="text-gray-700">{user.lastname}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} />
                Prénom
              </label>
              {editing ? (
                <Input defaultValue={user.firstname} />
              ) : (
                <p className="text-gray-700">{user.firstname}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar size={16} />
                Âge
              </label>
              {editing ? (
                <Input defaultValue={user.age} />
              ) : (
                <p className="text-gray-700">{user.age} ans</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users size={16} />
                Équipe
              </label>
              {editing ? (
                <Input defaultValue={user.team} />
              ) : (
                <p className="text-gray-700">
                  <Link 
                    to={`/team/${user.teamId}`} 
                    className="text-airsoft-red hover:underline flex items-center"
                  >
                    {user.team}
                    {user.isTeamLeader && (
                      <img 
                        src="/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png"
                        alt="Chef d'équipe"
                        className="w-4 h-4 ml-1"
                        title="Chef d'équipe"
                      />
                    )}
                  </Link>
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Localisation
              </label>
              {editing ? (
                <Input defaultValue={user.location} />
              ) : (
                <p className="text-gray-700">{user.location}</p>
              )}
            </div>
          </div>
        </CardContent>
        {editing && (
          <CardFooter>
            <Button className="bg-airsoft-red hover:bg-red-700" onClick={() => setEditing(false)}>
              <Save size={16} className="mr-2" />
              Enregistrer les modifications
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
          <CardDescription>
            Vos performances et participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Parties jouées</span>
              <span className="font-semibold">{user.stats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Parties organisées</span>
              <span className="font-semibold">{user.stats.gamesOrganized}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Réputation</span>
              <span className="font-semibold flex items-center">
                {user.stats.reputation}
                <svg className="w-4 h-4 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Niveau</span>
              <Badge className="bg-airsoft-red">{user.stats.level}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
