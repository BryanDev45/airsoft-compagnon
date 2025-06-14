import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, UserCheck, MessageSquare, ArrowLeft, Badge } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import UserReportsTab from '@/components/admin/UserReportsTab';
import MessageReportsTab from '@/components/admin/MessageReportsTab';
import VerificationRequestsTab from '@/components/admin/VerificationRequestsTab';
import BadgesManagementTab from '@/components/admin/BadgesManagementTab';

const Admin = () => {
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking auth
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handleReturnToSite}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retourner au site
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-airsoft-red" />
              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            </div>
            <div className="w-32"></div> {/* Spacer pour centrer le titre */}
          </div>
          <p className="text-gray-600">
            Gestion des signalements, modération et vérifications des comptes
          </p>
        </div>

        <Tabs defaultValue="user-reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="user-reports" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Signalements d'utilisateurs
            </TabsTrigger>
            <TabsTrigger value="message-reports" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Signalements de messages
            </TabsTrigger>
            <TabsTrigger value="verification-requests" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Vérifications de compte
            </TabsTrigger>
            <TabsTrigger value="badges-management" className="flex items-center gap-2">
              <Badge className="h-4 w-4" />
              Gestion des badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-reports">
            <UserReportsTab />
          </TabsContent>

          <TabsContent value="message-reports">
            <MessageReportsTab />
          </TabsContent>

          <TabsContent value="verification-requests">
            <VerificationRequestsTab />
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
