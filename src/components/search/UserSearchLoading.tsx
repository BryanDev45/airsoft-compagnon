
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserSearchLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
              <div className="ml-4 space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserSearchLoading;
