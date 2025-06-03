
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from 'lucide-react';

interface AccountTabProps {
  user: any;
}

const AccountTab = ({ user }: AccountTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-1">
          <Mail size={16} /> Email
        </Label>
        <Input id="email" value={user.email || ''} readOnly className="bg-gray-50" />
        <p className="text-xs text-gray-500">
          Cet email est utilisé pour la connexion et les notifications
        </p>
      </div>
    </div>
  );
};

export default AccountTab;
