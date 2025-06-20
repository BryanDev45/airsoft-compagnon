
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Bell, Shield, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Utilisateur';
  const avatarUrl = user?.avatar_url;

  return (
    <div className="space-y-4">
      {/* User Info avec Avatar */}
      <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
        <Avatar className="w-12 h-12">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-airsoft-red text-white font-semibold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-white truncate">
            {displayName}
          </p>
          <p className="text-sm text-gray-300">
            Connecté
          </p>
        </div>
      </div>

      <Separator className="bg-gray-600/50" />

      {/* Navigation Links */}
      <div className="space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          onClick={() => handleSheetOpenChange(false)}
        >
          <User size={20} />
          <span className="font-medium">Mon Profil</span>
        </Link>

        <Link
          to="/messages"
          className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          onClick={() => handleSheetOpenChange(false)}
        >
          <MessageSquare size={20} />
          <span className="font-medium">Messages</span>
        </Link>

        <Link
          to="/messages"
          className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          onClick={() => handleSheetOpenChange(false)}
        >
          <Bell size={20} />
          <span className="font-medium">Notifications</span>
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive" className="ml-auto bg-airsoft-red text-white text-xs">
              {unreadNotifications.length}
            </Badge>
          )}
        </Link>

        <Link
          to="/team"
          className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
          onClick={() => handleSheetOpenChange(false)}
        >
          <Users size={20} />
          <span className="font-medium">Mon Équipe</span>
        </Link>

        {/* Admin Button - Only visible for admin users */}
        {user?.Admin && (
          <Link
            to="/admin"
            className="flex items-center gap-3 py-3 px-4 text-white hover:text-airsoft-red hover:bg-gray-700/50 rounded-lg transition-all duration-200 active:scale-95"
            onClick={() => handleSheetOpenChange(false)}
          >
            <Shield size={20} />
            <span className="font-medium">Administration</span>
          </Link>
        )}
      </div>

      <Separator className="bg-gray-600/50" />

      {/* Logout Button - Red Color */}
      <div className="px-2">
        <Button
          onClick={() => {
            logout();
            handleSheetOpenChange(false);
          }}
          variant="outline"
          className="w-full flex items-center gap-2 border-red-600 text-red-400 hover:bg-red-600/10 hover:text-red-300 hover:border-red-500 transition-all duration-200"
        >
          <LogOut size={16} />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};
