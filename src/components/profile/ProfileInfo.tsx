
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ProfileInfo = ({ user, editing, setEditing }) => {
  return (
    <div className="bg-white rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-5">Informations personnelles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstname">Prénom</Label>
          <Input
            id="firstname"
            type="text"
            value={user.firstname}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Ce champ n'est pas modifiable</p>
        </div>
        <div>
          <Label htmlFor="lastname">Nom</Label>
          <Input
            id="lastname"
            type="text"
            value={user.lastname}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Ce champ n'est pas modifiable</p>
        </div>
        <div>
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            type="text"
            value={user.username}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
          />
        </div>
        <div>
          <Label htmlFor="age">Âge</Label>
          <Input
            id="age"
            type="text"
            value={user.age}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Ce champ n'est pas modifiable</p>
        </div>
        <div>
          <Label htmlFor="team">Équipe</Label>
          <Input
            id="team"
            type="text"
            value={user.team}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
          />
        </div>
        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            type="text"
            value={user.location}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
          />
        </div>
        <div>
          <Label htmlFor="joinDate">Date d'inscription</Label>
          <Input
            id="joinDate"
            type="text"
            value={user.joinDate}
            disabled={true}
            className="bg-gray-100"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="bio">Biographie</Label>
          <Textarea
            id="bio"
            value={user.bio}
            disabled={!editing}
            className={`min-h-[100px] ${!editing ? "bg-gray-100" : ""}`}
          />
        </div>
      </div>
      {editing ? (
        <div className="flex justify-end mt-6 space-x-3">
          <Button variant="outline" onClick={() => setEditing(false)}>
            Annuler
          </Button>
          <Button className="bg-airsoft-red hover:bg-red-700 text-white">
            Enregistrer
          </Button>
        </div>
      ) : (
        <div className="text-right mt-6">
          <Button onClick={() => setEditing(true)} className="bg-airsoft-red hover:bg-red-700 text-white">
            Modifier
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
