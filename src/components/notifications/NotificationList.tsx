
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
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
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Bell className="h-8 w-8 mb-2" />
          <p className="text-sm">Aucune notification</p>
        </div>
      </DropdownMenuContent>
    );
  }

  return (
    <DropdownMenuContent align="end" className="w-80">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-3">Notifications</h3>
        <ScrollArea className="h-96">
          <div className="space-y-3">
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
    </DropdownMenuContent>
  );
};

export default NotificationList;
