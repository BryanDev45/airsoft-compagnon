
import React from 'react';
import { Bell } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationActions } from '@/hooks/notifications/useNotificationActions';
import { useFriendRequestActions } from '@/hooks/notifications/useFriendRequestActions';
import { useTeamInvitationActions } from '@/hooks/notifications/useTeamInvitationActions';
import { useTeamRequestActions } from '@/hooks/notifications/useTeamRequestActions';
import NotificationItem from './NotificationItem';

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

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const { handleDeleteNotification, handleMarkAsRead, handleNavigateToNotification } = useNotificationActions();
  const { processingInvitation: processingFriend, handleAcceptFriendRequest, handleRejectFriendRequest } = useFriendRequestActions(handleMarkAsRead);
  const { processingInvitation, handleAcceptTeamInvitation, handleRejectTeamInvitation } = useTeamInvitationActions(handleMarkAsRead);
  const { processingRequest, handleAcceptTeamRequest, handleRejectTeamRequest } = useTeamRequestActions(handleMarkAsRead);

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Bell className="h-8 w-8 mb-2" />
        <p className="text-sm">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={handleDeleteNotification}
              onAcceptFriend={handleAcceptFriendRequest}
              onRejectFriend={handleRejectFriendRequest}
              onAcceptTeam={handleAcceptTeamInvitation}
              onRejectTeam={handleRejectTeamInvitation}
              onAcceptTeamRequest={handleAcceptTeamRequest}
              onRejectTeamRequest={handleRejectTeamRequest}
              onNavigate={handleNavigateToNotification}
              processingInvitation={processingInvitation || processingFriend}
              processingRequest={processingRequest}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;
