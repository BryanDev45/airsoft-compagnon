
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import NotificationList from '@/components/notifications/NotificationList';
import { Bell } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface NotificationSheetProps {
  notifications: any[];
  notificationCount: number;
  handleSheetOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

const NotificationSheet: React.FC<NotificationSheetProps> = ({
  notifications,
  notificationCount,
  handleSheetOpenChange,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <Sheet onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white">
            <Bell size={18} />
            <span>Notifications</span>
            {notificationCount > 0 && <Badge className="bg-airsoft-red">{notificationCount}</Badge>}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl">Notifications</SheetTitle>
          </SheetHeader>
          <NotificationList notifications={notifications} />
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">Fermer</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className={`${notificationCount > 0 ? 'text-airsoft-red' : 'text-white'} hover:text-airsoft-red transition-colors`} />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-airsoft-red">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl">Notifications</SheetTitle>
        </SheetHeader>
        <NotificationList notifications={notifications} />
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Fermer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;
