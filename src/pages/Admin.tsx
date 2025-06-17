
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, UserCheck, MessageSquare, ArrowLeft, Badge, Gavel, BarChart3 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import UserReportsTab from '@/components/admin/UserReportsTab';
import MessageReportsTab from '@/components/admin/MessageReportsTab';
import VerificationRequestsTab from '@/components/admin/VerificationRequestsTab';
import BadgesManagementTab from '@/components/admin/BadgesManagementTab';
import ModerationTab from '@/components/admin/ModerationTab';
import StatisticsTab from '@/components/admin/StatisticsTab';

const Admin = () => {
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking auth
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user?.Admin) {
    return <Navigate to="/" replace />;
  }

  const handleReturnToSite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header section - responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Button
              variant="outline"
              onClick={handleReturnToSite}
              className="flex items-center gap-2 w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retourner au site</span>
              <span className="sm:hidden">Retour</span>
            </Button>
            
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-airsoft-red" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Administration</h1>
            </div>
            
            {/* Spacer for desktop alignment */}
            <div className="hidden sm:block w-32"></div>
          </div>
          
          <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
            Gestion des signalements, modération et vérifications des comptes
          </p>
        </div>

        {/* Tabs section - mobile responsive */}
        <Tabs defaultValue="statistics" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="flex w-max min-w-full sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
              <TabsTrigger 
                value="statistics" 
                className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs whitespace-nowrap min-w-[100px] sm:min-w-0"
              >
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Statistiques</span>
              </TabsTrigger>

              <TabsTrigger 
                value="user-reports" 
                className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs whitespace-nowrap min-w-[100px] sm:min-w-0"
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">
                  <span className="block sm:hidden">Sign. Users</span>
                  <span className="hidden sm:block">Signalements d'utilisateurs</span>
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="message-reports" 
                className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs whitespace-nowrap min-w-[100px] sm:min-w-0"
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">
                  <span className="block sm:hidden">Sign. Messages</span>
                  <span className="hidden sm:block">Signalements de messages</span>
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="verification-requests" 
                className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs whitespace-nowrap min-w-[100px] sm:min-w-0"
              >
                <UserCheck className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">
                  <span className="block sm:hidden">Vérifications</span>
                  <span className="hidden sm:block">Vérifications de compte</span>
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="moderation" 
                className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs whitespace-nowrap min-w-[100px] sm:min-w-0"
              >
                <Gavel className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">
                  <span className="block sm:hidden">Modération</span>
                  <span className="hidden sm:block">Bans & Avertissements</span>
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="badges-management" 
                className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs whitespace-nowrap min-w-[100px] sm:min-w-0"
              >
                <Badge className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">
                  <span className="block sm:hidden">Badges</span>
                  <span className="hidden sm:block">Gestion des badges</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="statistics">
            <StatisticsTab />
          </TabsContent>

          <TabsContent value="user-reports">
            <UserReportsTab />
          </TabsContent>

          <TabsContent value="message-reports">
            <MessageReportsTab />
          </TabsContent>

          <TabsContent value="verification-requests">
            <VerificationRequestsTab />
          </TabsContent>
          
          <TabsContent value="moderation">
            <ModerationTab />
          </TabsContent>
          
          <TabsContent value="badges-management">
            <BadgesManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
