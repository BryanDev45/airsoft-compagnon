
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Ban, Search, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDeleteUserWarning } from '@/hooks/admin/useUserWarnings';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserWarning {
  id: string;
  warned_user_id: string;
  admin_id: string | null;
  reason: string;
  context: string | null;
  created_at: string;
  warned_user?: {
    username: string;
    firstname: string;
    lastname: string;
  };
  admin_user?: {
    username: string;
  };
}

interface BannedUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  Ban: boolean;
  ban_date: string;
  ban_reason: string;
  banned_by: string;
  ban_admin?: {
    username: string;
  };
}

const ModerationTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { mutate: deleteWarning, isPending: isDeletingWarning } = useDeleteUserWarning();

  // Fetch warnings
  const { data: warnings = [], isLoading: isLoadingWarnings, refetch: refetchWarnings } = useQuery({
    queryKey: ['admin-warnings', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('user_warnings')
        .select(`
          id,
          warned_user_id,
          admin_id,
          reason,
          context,
          created_at,
          warned_user:profiles!user_warnings_warned_user_id_fkey(username, firstname, lastname),
          admin_user:profiles!user_warnings_admin_id_fkey(username)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm.trim()) {
        // We need to join with profiles and filter on the user data
        const { data: filteredWarnings, error } = await supabase
          .from('user_warnings')
          .select(`
            id,
            warned_user_id,
            admin_id,
            reason,
            context,
            created_at,
            warned_user:profiles!user_warnings_warned_user_id_fkey(username, firstname, lastname),
            admin_user:profiles!user_warnings_admin_id_fkey(username)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter manually on the client side for now
        const filtered = filteredWarnings?.filter((warning: any) => {
          const user = warning.warned_user;
          if (!user) return false;
          
          const searchLower = searchTerm.toLowerCase();
          return (
            user.username?.toLowerCase().includes(searchLower) ||
            user.firstname?.toLowerCase().includes(searchLower) ||
            user.lastname?.toLowerCase().includes(searchLower)
          );
        }) || [];

        return filtered as UserWarning[];
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserWarning[];
    },
  });

  // Fetch banned users
  const { data: bannedUsers = [], isLoading: isLoadingBans, refetch: refetchBans } = useQuery({
    queryKey: ['admin-banned-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id, username, firstname, lastname, Ban, ban_date, ban_reason, banned_by,
          ban_admin:profiles!profiles_banned_by_fkey(username)
        `)
        .eq('Ban', true)
        .order('ban_date', { ascending: false });

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        query = query.or(`username.ilike.%${searchLower}%,firstname.ilike.%${searchLower}%,lastname.ilike.%${searchLower}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BannedUser[];
    },
  });

  const handleUnbanUser = async (userId: string, username: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          Ban: false,
          ban_date: null,
          ban_reason: null,
          banned_by: null
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Utilisateur débanni",
        description: `${username} a été débanni avec succès.`,
      });

      refetchBans();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur lors du débannissement: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteWarning = (warningId: string) => {
    deleteWarning(warningId, {
      onSuccess: () => {
        refetchWarnings();
      }
    });
  };

  const getDisplayName = (user: { username?: string; firstname?: string; lastname?: string }) => {
    if (user.username) return user.username;
    if (user.firstname && user.lastname) return `${user.firstname} ${user.lastname}`;
    if (user.firstname) return user.firstname;
    return 'Utilisateur inconnu';
  };

  const isLoading = isLoadingWarnings || isLoadingBans;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche
          </CardTitle>
          <CardDescription>
            Rechercher par nom d'utilisateur, prénom ou nom de famille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nom du joueur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Warnings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Avertissements ({warnings.length})
          </CardTitle>
          <CardDescription>
            Liste des avertissements donnés aux joueurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {warnings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'Aucun avertissement trouvé pour cette recherche.' : 'Aucun avertissement trouvé.'}
            </p>
          ) : (
            <div className="space-y-4">
              {warnings.map((warning) => (
                <div key={warning.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">
                          {getDisplayName(warning.warned_user || {})}
                        </span>
                        <Badge variant="outline" className="text-orange-700 border-orange-300">
                          Avertissement
                        </Badge>
                      </div>
                      <p className="text-sm mb-1">
                        <strong>Raison :</strong> {warning.reason}
                      </p>
                      {warning.context && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Contexte :</strong> {warning.context}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Donné le {format(new Date(warning.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}
                        {warning.admin_user?.username && ` par ${warning.admin_user.username}`}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isDeletingWarning}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer l'avertissement</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet avertissement ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteWarning(warning.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Banned Users Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            Utilisateurs bannis ({bannedUsers.length})
          </CardTitle>
          <CardDescription>
            Liste des utilisateurs actuellement bannis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bannedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'Aucun utilisateur banni trouvé pour cette recherche.' : 'Aucun utilisateur banni.'}
            </p>
          ) : (
            <div className="space-y-4">
              {bannedUsers.map((user) => (
                <div key={user.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">
                          {getDisplayName(user)}
                        </span>
                        <Badge variant="destructive">
                          Banni
                        </Badge>
                      </div>
                      <p className="text-sm mb-1">
                        <strong>Raison :</strong> {user.ban_reason || 'Non spécifiée'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Banni le {user.ban_date ? format(new Date(user.ban_date), 'd MMMM yyyy à HH:mm', { locale: fr }) : 'Date inconnue'}
                        {user.ban_admin?.username && ` par ${user.ban_admin.username}`}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Débannir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Débannir l'utilisateur</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir débannir {getDisplayName(user)} ? L'utilisateur pourra à nouveau accéder à la plateforme.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleUnbanUser(user.id, getDisplayName(user))}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Débannir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationTab;
