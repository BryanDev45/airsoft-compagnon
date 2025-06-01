
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  created_at: string;
  related_id: string | null;
}

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onAcceptFriend?: (notification: Notification) => void;
  onRejectFriend?: (notification: Notification) => void;
  onAcceptTeam?: (notification: Notification) => void;
  onRejectTeam?: (notification: Notification) => void;
  onAcceptTeamRequest?: (notification: Notification) => void;
  onRejectTeamRequest?: (notification: Notification) => void;
  onNavigate?: (notification: Notification) => void;
  processingInvitation?: boolean;
  processingRequest?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDelete,
  onAcceptFriend,
  onRejectFriend,
  onAcceptTeam,
  onRejectTeam,
  onAcceptTeamRequest,
  onRejectTeamRequest,
  onNavigate,
  processingInvitation = false,
  processingRequest = false
}) => {
  return (
    <div 
      className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'} transition-colors hover:bg-gray-100`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-gray-900">{notification.title}</h3>
        <div className="flex gap-1">
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
      
      {notification.type === 'friend_request' && !notification.read && onAcceptFriend && onRejectFriend ? (
        <div className="flex mt-2 space-x-2 justify-end">
          <Button 
            variant="default"
            size="sm"
            className="bg-airsoft-red hover:bg-red-700"
            onClick={() => onAcceptFriend(notification)}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Accepter
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onRejectFriend(notification)}
          >
            <UserMinus className="h-4 w-4 mr-1" />
            Refuser
          </Button>
        </div>
      ) : notification.type === 'team_invitation' && !notification.read && onAcceptTeam && onRejectTeam ? (
        <div className="flex mt-2 space-x-2 justify-end">
          <Button 
            variant="default"
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onAcceptTeam(notification)}
            disabled={processingInvitation}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Accepter
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onRejectTeam(notification)}
            disabled={processingInvitation}
          >
            <UserMinus className="h-4 w-4 mr-1" />
            Refuser
          </Button>
        </div>
      ) : notification.type === 'team_request' && !notification.read && onAcceptTeamRequest && onRejectTeamRequest ? (
        <div className="flex mt-2 space-x-2 justify-end">
          <Button 
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => onAcceptTeamRequest(notification)}
            disabled={processingRequest}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Accepter
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onRejectTeamRequest(notification)}
            disabled={processingRequest}
          >
            <UserMinus className="h-4 w-4 mr-1" />
            Refuser
          </Button>
        </div>
      ) : (
        <div 
          className="cursor-pointer" 
          onClick={() => onNavigate?.(notification)}
        />
      )}
    </div>
  );
};

export default NotificationItem;
