
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileInfo = ({ user, editing, setEditing, handleNavigateToTeam }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          Vos informations de profil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Prénom</p>
            <p className="font-medium">{user.firstname}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Nom</p>
            <p className="font-medium">{user.lastname}</p>
          </div>
          
          {editing ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input id="username" type="text" defaultValue={user.username} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Âge</p>
            <p className="font-medium">{user.age}</p>
          </div>
          
          {editing ? (
            <div className="space-y-1">
              <Label htmlFor="team">Équipe</Label>
              <Input id="team" type="text" defaultValue={user.team} />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Équipe</p>
              <p 
                className="font-medium text-airsoft-red hover:underline cursor-pointer" 
                onClick={handleNavigateToTeam}
              >
                {user.team}
              </p>
            </div>
          )}
          
          {editing ? (
            <div className="space-y-1">
              <Label htmlFor="location">Localisation</Label>
              <Input id="location" type="text" defaultValue={user.location} />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Localisation</p>
              <p className="font-medium">{user.location}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Date d'inscription</p>
            <p className="font-medium">{user.joinDate}</p>
          </div>
          
          {editing ? (
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" defaultValue={user.bio} className="min-h-[100px]" />
            </div>
          ) : (
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-gray-500">Biographie</p>
              <p className="font-medium">{user.bio}</p>
            </div>
          )}
        </div>
        
        {editing ? (
          <div className="flex justify-end mt-6 space-x-3">
            <Button variant="outline" onClick={() => setEditing(false)}>
              <X className="h-4 w-4 mr-2" /> Annuler
            </Button>
            <Button className="bg-airsoft-red hover:bg-red-700 text-white">
              <Save className="h-4 w-4 mr-2" /> Enregistrer
            </Button>
          </div>
        ) : (
          <div className="text-right mt-6">
            <Button onClick={() => setEditing(true)} className="bg-airsoft-red hover:bg-red-700 text-white">
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
