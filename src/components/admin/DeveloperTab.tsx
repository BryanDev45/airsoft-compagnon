import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronDown, 
  ChevronRight, 
  Code, 
  Database, 
  Globe, 
  Layers, 
  Settings, 
  Users, 
  MessageSquare, 
  Shield,
  Gamepad2,
  Store,
  Trophy,
  FileText,
  Search,
  Bell,
  GitBranch,
  Server,
  Key,
  Zap,
  AlertCircle,
  Info,
  ArrowRight,
  Package
} from 'lucide-react';

interface CodeExample {
  title: string;
  code: string;
  language: string;
}

interface Dependency {
  name: string;
  type: 'import' | 'hook' | 'service' | 'component' | 'database' | 'api' | 'utility';
  description: string;
  required: boolean;
  version?: string;
  path?: string;
}

interface DataFlow {
  from: string;
  to: string;
  description: string;
  type: 'hook' | 'component' | 'service' | 'database';
}

interface ModuleInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'page' | 'component' | 'hook' | 'service' | 'database' | 'utility';
  status: 'active' | 'deprecated' | 'beta';
  complexity: 'low' | 'medium' | 'high';
  dependencies?: Dependency[];
  features?: string[];
  children?: ModuleInfo[];
  technicalDetails?: {
    filePath?: string;
    mainExports?: string[];
    keyProps?: string[];
    stateManagement?: string;
    apiEndpoints?: string[];
    databaseTables?: string[];
    realTimeFeatures?: string[];
    cacheStrategy?: string;
    errorHandling?: string;
  };
  codeExamples?: CodeExample[];
  dataFlows?: DataFlow[];
}

const DeveloperTab = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("architecture");

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const siteArchitecture: ModuleInfo[] = [
    {
      name: "Système d'Authentification",
      description: "Architecture complète d'authentification avec Supabase Auth",
      icon: <Shield className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      complexity: 'high',
      dependencies: [
        {
          name: "@supabase/supabase-js",
          type: 'import',
          description: "Client Supabase pour l'authentification et les sessions",
          required: true,
          version: "^2.49.9",
          path: "src/integrations/supabase/client.ts"
        },
        {
          name: "@tanstack/react-query",
          type: 'import',
          description: "Cache et synchronisation des données d'authentification",
          required: true,
          version: "^5.79.2"
        },
        {
          name: "React Context API",
          type: 'service',
          description: "Partage de l'état d'authentification global",
          required: true
        },
        {
          name: "react-router-dom",
          type: 'import',
          description: "Navigation et protection des routes",
          required: true,
          version: "^6.26.2"
        }
      ],
      technicalDetails: {
        filePath: "src/hooks/auth/",
        mainExports: ["useAuth", "AuthProvider", "AuthGuard"],
        stateManagement: "React Context + React Query",
        apiEndpoints: ["/auth/login", "/auth/register", "/auth/oauth"],
        databaseTables: ["profiles", "auth.users"],
        realTimeFeatures: ["Session management", "Profile updates"],
        cacheStrategy: "React Query with 5min stale time",
        errorHandling: "Toast notifications + error boundaries"
      },
      children: [
        {
          name: "AuthProvider",
          description: "Context provider principal pour l'état d'authentification",
          icon: <Code className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          complexity: 'high',
          dependencies: [
            {
              name: "useAuthState",
              type: 'hook',
              description: "Hook pour la gestion de l'état d'authentification",
              required: true,
              path: "src/hooks/auth/useAuthState.tsx"
            },
            {
              name: "useAuthActions",
              type: 'hook',
              description: "Actions d'authentification (login, logout, register)",
              required: true,
              path: "src/hooks/auth/useAuthActions.tsx"
            },
            {
              name: "useAuthEventHandler",
              type: 'hook',
              description: "Gestion des événements Supabase Auth",
              required: true,
              path: "src/hooks/auth/state/useAuthEventHandler.tsx"
            },
            {
              name: "useSessionManager",
              type: 'hook',
              description: "Gestion des sessions utilisateur",
              required: true,
              path: "src/hooks/auth/state/useSessionManager.tsx"
            },
            {
              name: "React.createContext",
              type: 'api',
              description: "Création du contexte d'authentification",
              required: true
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/auth/AuthProvider.tsx",
            mainExports: ["AuthProvider", "AuthContext"],
            stateManagement: "React Context avec useReducer",
            realTimeFeatures: ["Session persistence", "Auto-refresh tokens"],
            errorHandling: "Centralized error handling avec toast"
          },
          codeExamples: [
            {
              title: "Utilisation basique",
              language: "typescript",
              code: `const { user, login, logout, loading } = useAuth();

if (loading) return <Loading />;
if (!user) return <LoginForm />;

return <Dashboard user={user} />;`
            }
          ],
          dataFlows: [
            {
              from: "Supabase Auth",
              to: "AuthProvider",
              description: "Session events et user data",
              type: 'service'
            },
            {
              from: "AuthProvider",
              to: "Components",
              description: "User state et auth actions",
              type: 'hook'
            }
          ]
        },
        {
          name: "useAuth Hook",
          description: "Hook principal pour accéder aux données d'authentification",
          icon: <Zap className="h-4 w-4" />,
          type: 'hook',
          status: 'active',
          complexity: 'medium',
          dependencies: [
            {
              name: "AuthContext",
              type: 'component',
              description: "Contexte d'authentification",
              required: true,
              path: "src/hooks/auth/AuthProvider.tsx"
            },
            {
              name: "React.useContext",
              type: 'api',
              description: "Consommation du contexte React",
              required: true
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/useAuth.tsx",
            mainExports: ["useAuth"],
            stateManagement: "Context consumption",
            cacheStrategy: "No cache, direct context access",
            errorHandling: "Throws errors to error boundary"
          },
          codeExamples: [
            {
              title: "Hook usage avec guards",
              language: "typescript",
              code: `const { user, isAuthenticated, initialLoading } = useAuth();

// Loading state
if (initialLoading) return <Spinner />;

// Redirect if not authenticated
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

// Protected content
return <ProtectedContent user={user} />;`
            }
          ]
        },
        {
          name: "Social Authentication",
          description: "OAuth avec Google et Discord",
          icon: <Users className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          complexity: 'medium',
          dependencies: [
            {
              name: "useSocialAuth",
              type: 'hook',
              description: "Hook pour l'authentification sociale",
              required: true,
              path: "src/hooks/auth/useSocialAuth.tsx"
            },
            {
              name: "Supabase Auth",
              type: 'service',
              description: "Service d'authentification OAuth",
              required: true
            },
            {
              name: "Google OAuth API",
              type: 'api',
              description: "API Google pour l'authentification",
              required: true
            },
            {
              name: "Discord OAuth API",
              type: 'api',
              description: "API Discord pour l'authentification",
              required: true
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/auth/useSocialAuth.tsx",
            mainExports: ["useSocialAuth"],
            apiEndpoints: ["/auth/oauth/google", "/auth/oauth/discord"],
            errorHandling: "OAuth redirect error handling",
            cacheStrategy: "Session storage for OAuth state"
          }
        }
      ]
    },
    {
      name: "Système de Messagerie",
      description: "Messagerie temps réel avec Supabase Realtime",
      icon: <MessageSquare className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      complexity: 'high',
      dependencies: [
        {
          name: "@supabase/supabase-js",
          type: 'import',
          description: "Client Supabase pour les subscriptions temps réel",
          required: true,
          version: "^2.49.9"
        },
        {
          name: "@tanstack/react-query",
          type: 'import',
          description: "Cache et mutations pour les messages",
          required: true,
          version: "^5.79.2"
        },
        {
          name: "Zustand",
          type: 'import',
          description: "State management pour l'état des conversations",
          required: false
        },
        {
          name: "useAuth",
          type: 'hook',
          description: "Authentification utilisateur pour les messages",
          required: true,
          path: "src/hooks/useAuth.tsx"
        }
      ],
      technicalDetails: {
        filePath: "src/components/messaging/",
        mainExports: ["MessagingIcon", "ChatView", "ConversationList"],
        stateManagement: "React Query + Zustand",
        databaseTables: ["conversations", "messages", "conversation_participants"],
        realTimeFeatures: ["Live messages", "Typing indicators", "Online presence"],
        cacheStrategy: "Infinite query avec optimistic updates",
        errorHandling: "Retry logic + offline support"
      },
      children: [
        {
          name: "Conversations Management",
          description: "Gestion des conversations directes et d'équipe",
          icon: <MessageSquare className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          complexity: 'high',
          dependencies: [
            {
              name: "useOptimizedConversations",
              type: 'hook',
              description: "Hook optimisé pour les conversations",
              required: true,
              path: "src/hooks/messaging/useOptimizedConversations.tsx"
            },
            {
              name: "useConversationData",
              type: 'hook',
              description: "Données des conversations",
              required: true,
              path: "src/hooks/messaging/useConversationData.tsx"
            },
            {
              name: "ConversationItem",
              type: 'component',
              description: "Composant d'affichage d'une conversation",
              required: true,
              path: "src/components/messaging/ConversationItem.tsx"
            },
            {
              name: "EmptyConversations",
              type: 'component',
              description: "État vide des conversations",
              required: true,
              path: "src/components/messaging/EmptyConversations.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/messaging/useOptimizedConversations.tsx",
            mainExports: ["useOptimizedConversations"],
            stateManagement: "React Query avec pagination",
            realTimeFeatures: ["Live conversation updates", "Unread count"],
            cacheStrategy: "Stale-while-revalidate avec 30s stale time",
            errorHandling: "Exponential backoff retry"
          },
          codeExamples: [
            {
              title: "Fetch conversations avec real-time",
              language: "typescript",
              code: `const { 
  conversations, 
  isLoading, 
  hasNextPage, 
  fetchNextPage 
} = useOptimizedConversations();

// Real-time subscription
useEffect(() => {
  const channel = supabase
    .channel('conversations')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'conversations'
    }, handleConversationUpdate)
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);`
            }
          ]
        },
        {
          name: "Real-time Messages",
          description: "Messages en temps réel avec optimistic updates",
          icon: <Zap className="h-4 w-4" />,
          type: 'hook',
          status: 'active',
          complexity: 'high',
          dependencies: [
            {
              name: "useRealtimeMessages",
              type: 'hook',
              description: "Hook pour les messages temps réel",
              required: true,
              path: "src/hooks/messaging/useRealtimeMessages.tsx"
            },
            {
              name: "useMessageActions",
              type: 'hook',
              description: "Actions sur les messages (send, edit, delete)",
              required: true,
              path: "src/hooks/messaging/useMessageActions.tsx"
            },
            {
              name: "useMessagesData",
              type: 'hook',
              description: "Données des messages",
              required: true,
              path: "src/hooks/messaging/useMessagesData.tsx"
            },
            {
              name: "MessageItem",
              type: 'component',
              description: "Composant d'affichage d'un message",
              required: true,
              path: "src/components/messaging/MessageItem.tsx"
            },
            {
              name: "MessageInput",
              type: 'component',
              description: "Composant de saisie de message",
              required: true,
              path: "src/components/messaging/MessageInput.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/messaging/useRealtimeMessages.tsx",
            mainExports: ["useRealtimeMessages"],
            stateManagement: "React Query mutations",
            realTimeFeatures: ["Live message updates", "Delivery status"],
            cacheStrategy: "Optimistic updates avec rollback",
            errorHandling: "Message retry queue"
          },
          codeExamples: [
            {
              title: "Optimistic message sending",
              language: "typescript",
              code: `const { sendMessage, messages } = useRealtimeMessages(conversationId);

const handleSendMessage = async (content: string) => {
  // Optimistic update
  const tempMessage = {
    id: generateTempId(),
    content,
    sender_id: user.id,
    created_at: new Date().toISOString(),
    status: 'sending'
  };

  try {
    await sendMessage.mutateAsync(content);
  } catch (error) {
    // Rollback optimistic update
    showErrorToast('Échec de l\'envoi du message');
  }
};`
            }
          ]
        },
        {
          name: "User Presence",
          description: "Système de présence utilisateur en temps réel",
          icon: <Users className="h-4 w-4" />,
          type: 'hook',
          status: 'active',
          complexity: 'medium',
          dependencies: [
            {
              name: "useUserPresence",
              type: 'hook',
              description: "Hook pour la présence utilisateur",
              required: true,
              path: "src/hooks/messaging/useUserPresence.tsx"
            },
            {
              name: "Supabase Realtime",
              type: 'service',
              description: "Service temps réel pour la présence",
              required: true
            },
            {
              name: "useAuth",
              type: 'hook',
              description: "Authentification pour associer la présence",
              required: true,
              path: "src/hooks/useAuth.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/messaging/useUserPresence.tsx",
            mainExports: ["useUserPresence", "useIsUserOnline"],
            databaseTables: ["user_presence"],
            realTimeFeatures: ["Online status", "Last seen"],
            cacheStrategy: "Background updates every 30s",
            errorHandling: "Graceful degradation if offline"
          }
        }
      ]
    },
    {
      name: "Système de Jeux",
      description: "Gestion complète des parties d'airsoft",
      icon: <Gamepad2 className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      complexity: 'high',
      dependencies: [
        {
          name: "react-hook-form",
          type: 'import',
          description: "Gestion des formulaires de création/édition",
          required: true,
          version: "^7.56.4"
        },
        {
          name: "zod",
          type: 'import',
          description: "Validation des schémas de jeu",
          required: true,
          version: "^3.25.56"
        },
        {
          name: "@hookform/resolvers",
          type: 'import',
          description: "Intégration Zod avec React Hook Form",
          required: true,
          version: "^5.0.1"
        },
        {
          name: "mapbox-gl",
          type: 'import',
          description: "Cartes pour la localisation des jeux",
          required: true,
          version: "^3.11.0"
        },
        {
          name: "useAuth",
          type: 'hook',
          description: "Authentification pour les actions de jeu",
          required: true,
          path: "src/hooks/useAuth.tsx"
        }
      ],
      technicalDetails: {
        filePath: "src/pages/",
        mainExports: ["GameDetails", "CreateParty", "EditGame"],
        databaseTables: ["airsoft_games", "game_participants", "game_comments"],
        stateManagement: "React Query + React Hook Form",
        cacheStrategy: "Aggressive caching avec background refetch",
        errorHandling: "Form validation + server error handling"
      },
      children: [
        {
          name: "Game Creation Flow",
          description: "Processus complet de création de partie",
          icon: <Gamepad2 className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          complexity: 'high',
          dependencies: [
            {
              name: "useCreatePartyForm",
              type: 'hook',
              description: "Hook pour le formulaire de création",
              required: true,
              path: "src/hooks/party/useCreatePartyForm.tsx"
            },
            {
              name: "usePartyFormValidation",
              type: 'hook',
              description: "Validation du formulaire de partie",
              required: true,
              path: "src/hooks/party/usePartyFormValidation.ts"
            },
            {
              name: "useImageUpload",
              type: 'hook',
              description: "Upload d'images pour le jeu",
              required: true,
              path: "src/hooks/useImageUpload.ts"
            },
            {
              name: "CoordinatesInput",
              type: 'component',
              description: "Input pour les coordonnées GPS",
              required: true,
              path: "src/components/party/CoordinatesInput.tsx"
            },
            {
              name: "LocationSection",
              type: 'component',
              description: "Section de localisation",
              required: true,
              path: "src/components/party/LocationSection.tsx"
            },
            {
              name: "ImageUploadSection",
              type: 'component',
              description: "Section d'upload d'images",
              required: true,
              path: "src/components/party/ImageUploadSection.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/pages/CreateParty.tsx",
            mainExports: ["CreateParty"],
            stateManagement: "React Hook Form avec Zod validation",
            apiEndpoints: ["/api/games", "/api/upload"],
            errorHandling: "Multi-step form validation"
          },
          codeExamples: [
            {
              title: "Form validation avec Zod",
              language: "typescript",
              code: `const gameSchema = z.object({
  title: z.string().min(3, "Titre trop court"),
  date: z.date().min(new Date(), "Date dans le futur"),
  max_players: z.number().min(2).max(100),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  })
});

const form = useForm<GameFormData>({
  resolver: zodResolver(gameSchema),
  defaultValues: {
    title: "",
    date: undefined,
    max_players: 20
  }
});`
            }
          ]
        },
        {
          name: "Game Registration System",
          description: "Système d'inscription aux parties",
          icon: <Users className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          complexity: 'medium',
          dependencies: [
            {
              name: "useGameRegistration",
              type: 'hook',
              description: "Hook pour l'inscription aux jeux",
              required: true,
              path: "src/hooks/game/useGameRegistration.tsx"
            },
            {
              name: "RegistrationDialog",
              type: 'component',
              description: "Dialog d'inscription",
              required: true,
              path: "src/components/game/RegistrationDialog.tsx"
            },
            {
              name: "ParticipantsDialog",
              type: 'component',
              description: "Dialog des participants",
              required: true,
              path: "src/components/game/ParticipantsDialog.tsx"
            },
            {
              name: "useAuth",
              type: 'hook',
              description: "Authentification pour l'inscription",
              required: true,
              path: "src/hooks/useAuth.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/game/useGameRegistration.tsx",
            mainExports: ["useGameRegistration"],
            databaseTables: ["game_participants"],
            stateManagement: "React Query mutations",
            cacheStrategy: "Invalidate queries on registration",
            errorHandling: "Conflict resolution pour places limitées"
          }
        }
      ]
    },
    {
      name: "Système d'Équipes",
      description: "Gestion complète des équipes d'airsoft",
      icon: <Users className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      complexity: 'high',
      dependencies: [
        {
          name: "@tanstack/react-query",
          type: 'import',
          description: "Cache et mutations pour les équipes",
          required: true,
          version: "^5.79.2"
        },
        {
          name: "react-hook-form",
          type: 'import',
          description: "Formulaires d'équipe",
          required: true,
          version: "^7.56.4"
        },
        {
          name: "zod",
          type: 'import',
          description: "Validation des données d'équipe",
          required: true,
          version: "^3.25.56"
        },
        {
          name: "useAuth",
          type: 'hook',
          description: "Authentification pour les actions d'équipe",
          required: true,
          path: "src/hooks/useAuth.tsx"
        }
      ],
      technicalDetails: {
        filePath: "src/components/team/",
        databaseTables: ["teams", "team_members", "team_invitations", "team_news"],
        stateManagement: "React Query + Context pour team state",
        realTimeFeatures: ["Team invitations", "Member updates"],
        cacheStrategy: "Hierarchical caching par team",
        errorHandling: "Permission-based error handling"
      },
      children: [
        {
          name: "Team Management",
          description: "Gestion des membres et permissions",
          icon: <Settings className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          complexity: 'high',
          dependencies: [
            {
              name: "useTeamMemberActions",
              type: 'hook',
              description: "Actions sur les membres d'équipe",
              required: true,
              path: "src/hooks/team/useTeamMemberActions.tsx"
            },
            {
              name: "useTeamData",
              type: 'hook',
              description: "Données de l'équipe",
              required: true,
              path: "src/hooks/useTeamData.ts"
            },
            {
              name: "useTeamSettings",
              type: 'hook',
              description: "Paramètres de l'équipe",
              required: true,
              path: "src/hooks/useTeamSettings.ts"
            },
            {
              name: "TeamMembers",
              type: 'component',
              description: "Liste des membres",
              required: true,
              path: "src/components/team/TeamMembers.tsx"
            },
            {
              name: "TeamSettingsMembers",
              type: 'component',
              description: "Gestion des membres dans les paramètres",
              required: true,
              path: "src/components/team/TeamSettingsMembers.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/hooks/team/useTeamMemberActions.tsx",
            mainExports: ["useTeamMemberActions"],
            databaseTables: ["team_members", "team_invitations"],
            stateManagement: "React Query avec optimistic updates",
            errorHandling: "Role-based action validation"
          },
          codeExamples: [
            {
              title: "Gestion des permissions d'équipe",
              language: "typescript",
              code: `const { 
  inviteMember, 
  removeMember, 
  updateMemberRole,
  canManageMembers 
} = useTeamMemberActions(teamId);

// Permission check
if (!canManageMembers) {
  return <AccessDenied />;
}

const handleInvite = async (email: string) => {
  try {
    await inviteMember.mutateAsync({ 
      email, 
      role: 'member' 
    });
    showSuccessToast('Invitation envoyée');
  } catch (error) {
    handleTeamError(error);
  }
};`
            }
          ]
        }
      ]
    },
    {
      name: "Système de Notifications",
      description: "Notifications en temps réel multi-types",
      icon: <Bell className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      complexity: 'medium',
      dependencies: [
        {
          name: "@tanstack/react-query",
          type: 'import',
          description: "Cache pour les notifications",
          required: true,
          version: "^5.79.2"
        },
        {
          name: "@supabase/supabase-js",
          type: 'import',
          description: "Real-time pour les notifications",
          required: true,
          version: "^2.49.9"
        },
        {
          name: "sonner",
          type: 'import',
          description: "Toast notifications",
          required: true,
          version: "^1.5.0"
        },
        {
          name: "useAuth",
          type: 'hook',
          description: "Authentification pour les notifications",
          required: true,
          path: "src/hooks/useAuth.tsx"
        }
      ],
      technicalDetails: {
        filePath: "src/hooks/notifications/",
        mainExports: ["useNotifications", "useOptimizedNotifications"],
        databaseTables: ["notifications"],
        stateManagement: "React Query avec polling",
        realTimeFeatures: ["Live notifications", "Push notifications"],
        cacheStrategy: "Background polling every 30s",
        errorHandling: "Graceful degradation + retry"
      },
      children: [
        {
          name: "Notification Types",
          description: "Différents types de notifications système",
          icon: <Bell className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          complexity: 'medium',
          features: [
            "Friend requests",
            "Team invitations", 
            "Game updates",
            "Admin notifications",
            "System announcements"
          ],
          dependencies: [
            {
              name: "useNotificationActions",
              type: 'hook',
              description: "Actions sur les notifications",
              required: true,
              path: "src/hooks/notifications/useNotificationActions.tsx"
            },
            {
              name: "useFriendRequestActions",
              type: 'hook',
              description: "Actions pour les demandes d'amis",
              required: true,
              path: "src/hooks/notifications/useFriendRequestActions.tsx"
            },
            {
              name: "useTeamInvitationActions",
              type: 'hook',
              description: "Actions pour les invitations d'équipe",
              required: true,
              path: "src/hooks/notifications/useTeamInvitationActions.tsx"
            },
            {
              name: "NotificationItem",
              type: 'component',
              description: "Composant d'affichage d'une notification",
              required: true,
              path: "src/components/notifications/NotificationItem.tsx"
            },
            {
              name: "NotificationList",
              type: 'component',
              description: "Liste des notifications",
              required: true,
              path: "src/components/notifications/NotificationList.tsx"
            }
          ],
          technicalDetails: {
            filePath: "src/components/notifications/",
            mainExports: ["NotificationItem", "NotificationList"],
            stateManagement: "React Query avec real-time updates",
            realTimeFeatures: ["Live notification count", "Auto-mark as read"],
            cacheStrategy: "Prefetch notification details"
          }
        }
      ]
    },
    {
      name: "Base de Données",
      description: "Architecture Supabase avec RLS",
      icon: <Database className="h-4 w-4" />,
      type: 'database',
      status: 'active',
      complexity: 'high',
      dependencies: [
        {
          name: "PostgreSQL",
          type: 'database',
          description: "Base de données principale",
          required: true,
          version: "15+"
        },
        {
          name: "Supabase Platform",
          type: 'service',
          description: "Platform BaaS pour PostgreSQL",
          required: true
        },
        {
          name: "Row Level Security",
          type: 'database',
          description: "Sécurité au niveau des lignes",
          required: true
        },
        {
          name: "Supabase Realtime",
          type: 'service',
          description: "Service temps réel",
          required: true
        }
      ],
      technicalDetails: {
        filePath: "supabase/migrations/",
        databaseTables: ["25+ tables avec relations complexes"],
        stateManagement: "Row Level Security (RLS)",
        realTimeFeatures: ["Tous les tables avec REPLICA IDENTITY FULL"],
        cacheStrategy: "Supabase edge caching",
        errorHandling: "Database triggers + constraints"
      },
      children: [
        {
          name: "Security Architecture",
          description: "Système de sécurité avec RLS et policies",
          icon: <Shield className="h-4 w-4" />,
          type: 'database',
          status: 'active',
          complexity: 'high',
          dependencies: [
            {
              name: "PostgreSQL RLS",
              type: 'database',
              description: "Row Level Security natif PostgreSQL",
              required: true
            },
            {
              name: "Supabase Auth",
              type: 'service',
              description: "Service d'authentification intégré",
              required: true
            },
            {
              name: "auth.uid()",
              type: 'utility',
              description: "Fonction Supabase pour l'ID utilisateur",
              required: true
            },
            {
              name: "auth.jwt()",
              type: 'utility',
              description: "Fonction Supabase pour les claims JWT",
              required: true
            }
          ],
          technicalDetails: {
            filePath: "supabase/migrations/",
            mainExports: ["RLS Policies", "Security Functions"],
            stateManagement: "Row Level Security",
            errorHandling: "Policy-based access control"
          },
          codeExamples: [
            {
              title: "Exemple de RLS Policy",
              language: "sql",
              code: `-- Policy pour les messages privés
CREATE POLICY "Users can only see their own messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );`
            }
          ]
        },
        {
          name: "Real-time Subscriptions",
          description: "Configuration temps réel pour toutes les tables",
          icon: <Zap className="h-4 w-4" />,
          type: 'database',
          status: 'active',
          complexity: 'medium',
          dependencies: [
            {
              name: "Supabase Realtime Server",
              type: 'service',
              description: "Serveur temps réel Supabase",
              required: true
            },
            {
              name: "PostgreSQL WAL",
              type: 'database',
              description: "Write-Ahead Log pour le streaming",
              required: true
            },
            {
              name: "Phoenix Channels",
              type: 'service',
              description: "WebSocket channels pour le temps réel",
              required: true
            }
          ],
          technicalDetails: {
            filePath: "supabase/migrations/",
            realTimeFeatures: ["Toutes tables en REPLICA IDENTITY FULL"],
            cacheStrategy: "Supabase realtime avec filtering",
            errorHandling: "Connection resilience"
          },
          codeExamples: [
            {
              title: "Configuration realtime",
              language: "sql",
              code: `-- Enable realtime
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Add to publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;`
            }
          ]
        }
      ]
    }
  ];

  const architecturePrinciples = [
    {
      title: "Separation of Concerns",
      description: "Chaque module a une responsabilité claire et définie",
      icon: <Layers className="h-4 w-4" />,
      examples: [
        "Hooks pour la logique métier",
        "Components pour l'UI",
        "Services pour les API calls",
        "Utils pour les fonctions helper"
      ]
    },
    {
      title: "Data Fetching Strategy",
      description: "React Query pour le cache et state management",
      icon: <Database className="h-4 w-4" />,
      examples: [
        "Stale-while-revalidate par défaut",
        "Optimistic updates pour les mutations",
        "Background refetch pour les données critiques",
        "Infinite queries pour les listes paginées"
      ]
    },
    {
      title: "Error Handling",
      description: "Gestion d'erreurs à plusieurs niveaux",
      icon: <AlertCircle className="h-4 w-4" />,
      examples: [
        "Error boundaries pour les erreurs React",
        "Toast notifications pour les erreurs user",
        "Retry logic pour les erreurs réseau",
        "Graceful degradation pour l'offline"
      ]
    },
    {
      title: "Performance Optimization",
      description: "Optimisations pour une expérience fluide",
      icon: <Zap className="h-4 w-4" />,
      examples: [
        "Code splitting par route",
        "Lazy loading des composants",
        "Memoization des calculs coûteux",
        "Virtual scrolling pour les grandes listes"
      ]
    }
  ];

  const codePatterns = [
    {
      title: "Custom Hooks Pattern",
      description: "Encapsulation de la logique métier",
      code: `// Hook personnalisé pour la gestion des jeux
export const useGameData = (gameId: string) => {
  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameById(gameId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { mutate: updateGame } = useMutation({
    mutationFn: updateGameData,
    onSuccess: () => {
      queryClient.invalidateQueries(['game', gameId]);
      showSuccessToast('Jeu mis à jour');
    },
    onError: (error) => {
      handleGameError(error);
    }
  });

  return { game, isLoading, updateGame };
};`
    },
    {
      title: "Optimistic Updates Pattern",
      description: "Mise à jour optimiste pour l'UX",
      code: `const { mutate: sendMessage } = useMutation({
  mutationFn: async (content: string) => {
    // Optimistic update
    queryClient.setQueryData(['messages', conversationId], (old) => [
      ...old,
      { id: tempId, content, status: 'sending' }
    ]);

    const result = await sendMessageAPI(content);
    
    // Replace temp message with real one
    queryClient.setQueryData(['messages', conversationId], (old) =>
      old.map(msg => msg.id === tempId ? result : msg)
    );

    return result;
  },
  onError: () => {
    // Rollback on error
    queryClient.setQueryData(['messages', conversationId], (old) =>
      old.filter(msg => msg.id !== tempId)
    );
  }
});`
    },
    {
      title: "Real-time Subscription Pattern",
      description: "Intégration Supabase Realtime",
      code: `useEffect(() => {
  const channel = supabase
    .channel(\`game-\${gameId}\`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'game_participants',
      filter: \`game_id=eq.\${gameId}\`
    }, (payload) => {
      queryClient.invalidateQueries(['game', gameId, 'participants']);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [gameId]);`
    },
    {
      title: "Form Validation Pattern",
      description: "Validation avec Zod et React Hook Form",
      code: `const schema = z.object({
  title: z.string().min(3, 'Titre requis'),
  date: z.date().min(new Date(), 'Date future requise'),
  maxPlayers: z.number().min(2).max(100)
});

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    title: '',
    maxPlayers: 20
  }
});

const onSubmit = async (data: FormData) => {
  try {
    await createGame.mutateAsync(data);
    navigate('/games');
  } catch (error) {
    form.setError('root', { message: error.message });
  }
};`
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'bg-blue-100 text-blue-800';
      case 'component':
        return 'bg-purple-100 text-purple-800';
      case 'hook':
        return 'bg-orange-100 text-orange-800';
      case 'service':
        return 'bg-indigo-100 text-indigo-800';
      case 'database':
        return 'bg-cyan-100 text-cyan-800';
      case 'utility':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDependencyTypeColor = (type: string) => {
    switch (type) {
      case 'import':
        return 'bg-blue-100 text-blue-700';
      case 'hook':
        return 'bg-orange-100 text-orange-700';
      case 'component':
        return 'bg-purple-100 text-purple-700';
      case 'service':
        return 'bg-indigo-100 text-indigo-700';
      case 'database':
        return 'bg-cyan-100 text-cyan-700';
      case 'api':
        return 'bg-green-100 text-green-700';
      case 'utility':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderModuleTree = (modules: ModuleInfo[], level = 0) => {
    return modules.map((module, index) => {
      const hasChildren = module.children && module.children.length > 0;
      const itemId = `${level}-${index}`;
      const isExpanded = expandedItems.includes(itemId);

      return (
        <div key={itemId} className={`${level > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''}`}>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-gray-50"
                onClick={() => hasChildren && toggleExpanded(itemId)}
              >
                <div className="flex items-start gap-3 w-full">
                  {hasChildren ? (
                    isExpanded ? <ChevronDown className="h-4 w-4 mt-1" /> : <ChevronRight className="h-4 w-4 mt-1" />
                  ) : (
                    <div className="w-4" />
                  )}
                  {module.icon}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{module.name}</span>
                      <Badge className={getStatusColor(module.status)} variant="outline">
                        {module.status}
                      </Badge>
                      <Badge className={getTypeColor(module.type)} variant="outline">
                        {module.type}
                      </Badge>
                      <Badge className={getComplexityColor(module.complexity)} variant="outline">
                        {module.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                    
                    {/* Dependencies */}
                    {module.dependencies && module.dependencies.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Dépendances:</span>
                        </div>
                        <div className="space-y-2">
                          {module.dependencies.map((dep, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getDependencyTypeColor(dep.type)} variant="outline">
                                  {dep.type}
                                </Badge>
                                <span className="font-medium text-sm text-gray-900">{dep.name}</span>
                                {dep.version && (
                                  <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                                    {dep.version}
                                  </Badge>
                                )}
                                {dep.required && (
                                  <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                                    requis
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{dep.description}</p>
                              {dep.path && (
                                <div className="flex items-center gap-1">
                                  <ArrowRight className="h-3 w-3 text-gray-400" />
                                  <code className="text-xs text-purple-600">{dep.path}</code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {module.features && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500 mb-1 block">Fonctionnalités:</span>
                        <div className="flex flex-wrap gap-1">
                          {module.features.map((feature, idx) => (
                            <Badge key={idx} className="bg-blue-50 text-blue-700 text-xs" variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Details */}
                    {module.technicalDetails && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {module.technicalDetails.filePath && (
                            <div>
                              <span className="font-medium text-gray-700">Chemin:</span>
                              <code className="ml-1 text-purple-600">{module.technicalDetails.filePath}</code>
                            </div>
                          )}
                          {module.technicalDetails.mainExports && (
                            <div>
                              <span className="font-medium text-gray-700">Exports:</span>
                              <span className="ml-1 text-green-600">{module.technicalDetails.mainExports.join(', ')}</span>
                            </div>
                          )}
                          {module.technicalDetails.stateManagement && (
                            <div>
                              <span className="font-medium text-gray-700">State:</span>
                              <span className="ml-1 text-orange-600">{module.technicalDetails.stateManagement}</span>
                            </div>
                          )}
                          {module.technicalDetails.cacheStrategy && (
                            <div>
                              <span className="font-medium text-gray-700">Cache:</span>
                              <span className="ml-1 text-blue-600">{module.technicalDetails.cacheStrategy}</span>
                            </div>
                          )}
                          {module.technicalDetails.realTimeFeatures && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Real-time:</span>
                              <span className="ml-1 text-red-600">{module.technicalDetails.realTimeFeatures.join(', ')}</span>
                            </div>
                          )}
                          {module.technicalDetails.errorHandling && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Error Handling:</span>
                              <span className="ml-1 text-yellow-600">{module.technicalDetails.errorHandling}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Code Examples */}
                    {module.codeExamples && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500 mb-2 block">Exemples de code:</span>
                        {module.codeExamples.map((example, idx) => (
                          <div key={idx} className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs mb-2">
                            <div className="text-green-400 font-medium mb-1">{example.title}</div>
                            <pre className="whitespace-pre-wrap overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Data Flows */}
                    {module.dataFlows && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500 mb-2 block">Flux de données:</span>
                        <div className="space-y-1">
                          {module.dataFlows.map((flow, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <span className="font-medium text-blue-600">{flow.from}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-green-600">{flow.to}</span>
                              <span className="text-gray-500">({flow.description})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            {hasChildren && (
              <CollapsibleContent className={`${isExpanded ? 'block' : 'hidden'} mt-2`}>
                {renderModuleTree(module.children!, level + 1)}
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Documentation Développeur - Airsoft Companion
          </CardTitle>
          <CardDescription>
            Documentation technique complète pour les développeurs externes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="patterns">Patterns Code</TabsTrigger>
              <TabsTrigger value="principles">Principes</TabsTrigger>
              <TabsTrigger value="stack">Stack Tech</TabsTrigger>
            </TabsList>

            <TabsContent value="architecture" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Pages & Routes</span>
                  </div>
                  <p className="text-sm text-blue-700">12 pages avec React Router, guards et lazy loading</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Composants</span>
                  </div>
                  <p className="text-sm text-purple-700">150+ composants avec shadcn/ui et patterns réutilisables</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">Base de Données</span>
                  </div>
                  <p className="text-sm text-green-700">25+ tables Supabase avec RLS et real-time</p>
                </div>
              </div>

              <ScrollArea className="h-[800px] w-full">
                <div className="space-y-2">
                  {renderModuleTree(siteArchitecture)}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="patterns" className="mt-6">
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Patterns de Code Utilisés</h3>
                  <p className="text-gray-600">Exemples concrets des patterns architecturaux implémentés dans le projet.</p>
                </div>
                
                {codePatterns.map((pattern, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">{pattern.title}</CardTitle>
                      <CardDescription>{pattern.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                          <code>{pattern.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="principles" className="mt-6">
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Principes Architecturaux</h3>
                  <p className="text-gray-600">Les principes fondamentaux qui guident le développement du projet.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {architecturePrinciples.map((principle, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          {principle.icon}
                          {principle.title}
                        </CardTitle>
                        <CardDescription>{principle.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {principle.examples.map((example, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stack" className="mt-6">
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Stack Technologique</h3>
                  <p className="text-gray-600">Technologies, versions et configuration utilisées.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'React', version: '18.3.1', type: 'Frontend Framework', description: 'Library principale avec hooks et contexte' },
                    { name: 'TypeScript', version: 'Latest', type: 'Language', description: 'Typage strict pour la robustesse' },
                    { name: 'Vite', version: 'Latest', type: 'Build Tool', description: 'Build rapide avec HMR' },
                    { name: 'Tailwind CSS', version: 'Latest', type: 'Styling', description: 'Utility-first CSS framework' },
                    { name: 'Shadcn/ui', version: 'Latest', type: 'UI Library', description: 'Composants pré-built avec Radix' },
                    { name: 'React Query', version: '5.79.2', type: 'State Management', description: 'Cache et synchronisation server state' },
                    { name: 'React Router', version: '6.26.2', type: 'Routing', description: 'Routing avec lazy loading' },
                    { name: 'Supabase', version: '2.49.9', type: 'Backend', description: 'Database, Auth, Storage, Real-time' },
                    { name: 'React Hook Form', version: '7.56.4', type: 'Forms', description: 'Gestion forms avec validation' },
                    { name: 'Zod', version: '3.25.56', type: 'Validation', description: 'Schema validation TypeScript-first' },
                    { name: 'Lucide React', version: '0.462.0', type: 'Icons', description: 'Icônes SVG légères' },
                    { name: 'Date-fns', version: '3.6.0', type: 'Utils', description: 'Manipulation des dates' }
                  ].map((tech, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-gray-900">{tech.name}</div>
                        <Badge variant="outline" className="text-xs">{tech.type}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{tech.version}</div>
                      <div className="text-xs text-gray-500">{tech.description}</div>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configuration du Projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Structure des Dossiers</h4>
                        <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
                          <pre>{`src/
├── components/     # Composants réutilisables
│   ├── ui/        # Composants shadcn/ui
│   ├── auth/      # Composants d'authentification
│   ├── messaging/ # Composants de messagerie
│   └── ...
├── hooks/         # Custom hooks
├── pages/         # Pages de l'application
├── utils/         # Fonctions utilitaires
├── types/         # Types TypeScript
└── lib/          # Configuration libraries`}</pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Scripts Principaux</h4>
                        <div className="space-y-2 text-sm">
                          <div><code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> - Serveur de développement</div>
                          <div><code className="bg-gray-100 px-2 py-1 rounded">npm run build</code> - Build de production</div>
                          <div><code className="bg-gray-100 px-2 py-1 rounded">npm run preview</code> - Preview du build</div>
                          <div><code className="bg-gray-100 px-2 py-1 rounded">npm run type-check</code> - Vérification TypeScript</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Guide de Démarrage Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Installation</h4>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
                <pre>{`# Cloner le projet
git clone [repository-url]

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Démarrer le serveur de développement
npm run dev`}</pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Variables d'Environnement</h4>
              <div className="space-y-2 text-sm">
                <div><code className="bg-gray-100 px-2 py-1 rounded">VITE_SUPABASE_URL</code> - URL Supabase</div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code> - Clé publique Supabase</div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">VITE_MAPBOX_TOKEN</code> - Token Mapbox pour la carte</div>
                <div><code className="bg-gray-100 px-2 py-1 rounded">VITE_GEOCODING_API_KEY</code> - Clé API géocodage</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperTab;
