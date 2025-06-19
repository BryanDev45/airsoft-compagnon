
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MobileAuthSectionProps {
  user: any;
  logout: () => void;
  notifications: any[];
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
}

export const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({
  user,
  logout,
  notifications,
  notificationCount,
  handleSheetOpenChange
}) => {
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-4">
      {/* User Info */}
      <div className="flex items-center gap-3 p-2">
        <div className="w-10 h-10 bg-airsoft-red rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.display_name || user?.email || 'Utilisateur'}
          </p>
          <p className="text-xs text-gray-300">
            Connecté
          </p>
        </div>
      </div>

      <Separator className="bg-gray-600/50" />

      {/* Navigation Links */}
      <div className="space-y-1">
        <Link
          to="/profile"
          className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          onClick={() => handleSheetOpenChange(false)}
        >
          <User size={18} />
          <span className="font-medium">Mon Profil</span>
        </Link>

        <Link
          to="/messages"
          className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          onClick={() => handleSheetOpenChange(false)}
        >
          <Bell size={18} />
          <span className="font-medium">Notifications</span>
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive" className="ml-auto bg-airsoft-red text-white">
              {unreadNotifications.length}
            </Badge>
          )}
        </Link>

        {/* Admin Button - Only visible for admin users */}
        {user?.Admin && (
          <Link
            to="/admin"
            className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
            onClick={() => handleSheetOpenChange(false)}
          >
            <Shield size={18} />
            <span className="font-medium">Administration</span>
          </Link>
        )}
      </div>

      <Separator className="bg-gray-600/50" />

      {/* Logout Button */}
      <div className="px-2">
        <Button
          onClick={() => {
            logout();
            handleSheetOpenChange(false);
          }}
          variant="outline"
          className="w-full flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700/50 hover:text-airsoft-red transition-all duration-200"
        >
          <LogOut size={16} />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};
