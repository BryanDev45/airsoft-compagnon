
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Bell
} from 'lucide-react';

interface ModuleInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'page' | 'component' | 'hook' | 'service' | 'database';
  status: 'active' | 'deprecated' | 'beta';
  dependencies?: string[];
  features?: string[];
  children?: ModuleInfo[];
}

const DeveloperTab = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const siteArchitecture: ModuleInfo[] = [
    {
      name: "Pages Core",
      description: "Pages principales de l'application",
      icon: <Globe className="h-4 w-4" />,
      type: 'page',
      status: 'active',
      children: [
        {
          name: "Index (Accueil)",
          description: "Page d'accueil avec héros, sections bénéfices et carte",
          icon: <Globe className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Hero Section", "Benefits Section", "Map Section", "Contact Section"],
          dependencies: ["Hero", "BenefitsSection", "MapSection", "ContactSection"]
        },
        {
          name: "Parties",
          description: "Recherche et découverte de parties d'airsoft",
          icon: <Search className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Filtres avancés", "Carte interactive", "Recherche par localisation"],
          dependencies: ["MapComponent", "SearchFiltersSidebar", "EventCard"]
        },
        {
          name: "Profile",
          description: "Profil utilisateur avec gestion complète",
          icon: <Users className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Édition profil", "Équipements", "Statistiques", "Badges", "Amis"],
          dependencies: ["ProfileContainer", "ProfileHeader", "ProfileStats", "ProfileEquipment"]
        },
        {
          name: "Messages",
          description: "Système de messagerie en temps réel",
          icon: <MessageSquare className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Conversations directes", "Messages d'équipe", "Temps réel", "Statut en ligne"],
          dependencies: ["ConversationList", "ChatView", "MessagingIcon"]
        },
        {
          name: "Admin",
          description: "Panel d'administration complet",
          icon: <Shield className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Statistiques", "Modération", "Signalements", "Vérifications", "Badges"],
          dependencies: ["StatisticsTab", "ModerationTab", "UserReportsTab", "BadgesManagementTab"]
        }
      ]
    },
    {
      name: "Système d'Authentification",
      description: "Gestion complète des utilisateurs et permissions",
      icon: <Shield className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "Login/Register",
          description: "Authentification email et sociale",
          icon: <Users className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["Email/Password", "Google OAuth", "Discord OAuth", "Validation formulaire"],
          dependencies: ["useAuth", "Supabase Auth", "React Hook Form"]
        },
        {
          name: "AuthGuard",
          description: "Protection des routes privées",
          icon: <Shield className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["Route protection", "Redirection automatique"],
          dependencies: ["useAuth", "React Router"]
        },
        {
          name: "useAuth Hook",
          description: "Hook central pour la gestion de l'authentification",
          icon: <Code className="h-4 w-4" />,
          type: 'hook',
          status: 'active',
          features: ["État utilisateur", "Actions auth", "Session management"],
          dependencies: ["Supabase", "React Query"]
        }
      ]
    },
    {
      name: "Système de Jeux",
      description: "Gestion complète des parties d'airsoft",
      icon: <Gamepad2 className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "GameDetails",
          description: "Affichage détaillé d'une partie avec inscriptions",
          icon: <Gamepad2 className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Détails partie", "Inscriptions", "Commentaires", "Participants", "Images"],
          dependencies: ["GameHeader", "GameTabs", "RegistrationDialog", "GameComments"]
        },
        {
          name: "CreateParty",
          description: "Création de nouvelles parties",
          icon: <Gamepad2 className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Formulaire complet", "Upload images", "Géolocalisation", "Validation"],
          dependencies: ["useCreatePartyForm", "ImageUploadSection", "CoordinatesInput"]
        },
        {
          name: "EditGame",
          description: "Modification des parties existantes",
          icon: <Settings className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Édition complète", "Gestion participants", "Images"],
          dependencies: ["useGameEditForm", "useGameDeletion"]
        }
      ]
    },
    {
      name: "Système de Messagerie",
      description: "Communication en temps réel entre utilisateurs",
      icon: <MessageSquare className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "Conversations",
          description: "Gestion des conversations directes et d'équipe",
          icon: <MessageSquare className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["Messages temps réel", "Statut en ligne", "Messages non lus"],
          dependencies: ["useOptimizedConversations", "useRealtimeMessages", "Supabase Realtime"]
        },
        {
          name: "ChatView",
          description: "Interface de chat avec saisie et affichage messages",
          icon: <MessageSquare className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["Messages temps réel", "Saisie message", "Statut typing"],
          dependencies: ["MessageItem", "MessageInput", "useTypingStatus"]
        },
        {
          name: "User Presence",
          description: "Système de présence utilisateur en temps réel",
          icon: <Users className="h-4 w-4" />,
          type: 'hook',
          status: 'active',
          features: ["Statut en ligne", "Dernière connexion"],
          dependencies: ["Supabase Realtime", "user_presence table"]
        }
      ]
    },
    {
      name: "Système d'Équipes",
      description: "Gestion complète des équipes d'airsoft",
      icon: <Users className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "Team Profile",
          description: "Profil d'équipe avec membres et actualités",
          icon: <Users className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Informations équipe", "Membres", "Actualités", "Terrains", "Paramètres"],
          dependencies: ["TeamHeader", "TeamMembers", "TeamNews", "TeamSettings"]
        },
        {
          name: "CreateTeam",
          description: "Création de nouvelles équipes",
          icon: <Users className="h-4 w-4" />,
          type: 'page',
          status: 'active',
          features: ["Formulaire création", "Upload média", "Validation"],
          dependencies: ["CreateTeamForm", "useCreateTeam"]
        },
        {
          name: "Team Management",
          description: "Gestion des membres et invitations",
          icon: <Settings className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          features: ["Invitations", "Gestion membres", "Rôles", "Permissions"],
          dependencies: ["useTeamMemberActions", "team_invitations table"]
        }
      ]
    },
    {
      name: "Toolbox",
      description: "Outils et ressources pour les joueurs",
      icon: <Settings className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "Calculateurs",
          description: "Calculateurs techniques pour l'airsoft",
          icon: <Settings className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["FPS/Joule", "Ratio engrenage", "Batterie", "Compatibilité électrique"],
          dependencies: ["FpsJouleCalculator", "GearRatioCalculator", "BatteryCalculator"]
        },
        {
          name: "Glossaire",
          description: "Dictionnaire des termes airsoft",
          icon: <FileText className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["Recherche termes", "Catégories", "Gestion admin"],
          dependencies: ["AirsoftGlossary", "useGlossary", "glossary table"]
        },
        {
          name: "Scénarios",
          description: "Base de données de scénarios de jeu",
          icon: <Gamepad2 className="h-4 w-4" />,
          type: 'component',
          status: 'active',
          features: ["Scénarios prédéfinis", "Filtres", "Gestion admin"],
          dependencies: ["AirsoftScenarios", "useScenarios", "scenarios table"]
        }
      ]
    },
    {
      name: "Système de Notifications",
      description: "Notifications en temps réel pour les utilisateurs",
      icon: <Bell className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "Notifications Core",
          description: "Système de notifications multi-types",
          icon: <Bell className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          features: ["Demandes d'amis", "Invitations équipe", "Notifications admin"],
          dependencies: ["useNotifications", "NotificationItem", "notifications table"]
        },
        {
          name: "Real-time Updates",
          description: "Mise à jour temps réel des notifications",
          icon: <Bell className="h-4 w-4" />,
          type: 'hook',
          status: 'active',
          features: ["Supabase Realtime", "Auto-refresh", "Compteur non lus"],
          dependencies: ["Supabase Realtime", "useOptimizedNotifications"]
        }
      ]
    },
    {
      name: "Base de Données",
      description: "Structure de données Supabase",
      icon: <Database className="h-4 w-4" />,
      type: 'database',
      status: 'active',
      children: [
        {
          name: "Tables Utilisateurs",
          description: "Profils, authentification et relations",
          icon: <Database className="h-4 w-4" />,
          type: 'database',
          status: 'active',
          features: ["profiles", "friendships", "user_badges", "user_stats", "user_presence"],
          dependencies: ["Supabase Auth", "RLS Policies"]
        },
        {
          name: "Tables Jeux",
          description: "Parties, participants et commentaires",
          icon: <Database className="h-4 w-4" />,
          type: 'database',
          status: 'active',
          features: ["airsoft_games", "game_participants", "game_comments"],
          dependencies: ["Géolocalisation", "Upload images"]
        },
        {
          name: "Tables Messagerie",
          description: "Conversations et messages",
          icon: <Database className="h-4 w-4" />,
          type: 'database',
          status: 'active',
          features: ["conversations", "messages", "conversation_participants", "message_read_status"],
          dependencies: ["Supabase Realtime", "RLS Policies"]
        },
        {
          name: "Tables Équipes",
          description: "Équipes, membres et actualités",
          icon: <Database className="h-4 w-4" />,
          type: 'database',
          status: 'active',
          features: ["teams", "team_members", "team_news", "team_invitations"],
          dependencies: ["Upload média", "Géolocalisation"]
        }
      ]
    },
    {
      name: "Système de Modération",
      description: "Outils de modération et administration",
      icon: <Shield className="h-4 w-4" />,
      type: 'service',
      status: 'active',
      children: [
        {
          name: "Signalements",
          description: "Système de signalement utilisateurs et messages",
          icon: <Shield className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          features: ["Signalements utilisateurs", "Signalements messages", "Workflow admin"],
          dependencies: ["user_reports", "message_reports", "ResolveReportDialog"]
        },
        {
          name: "Vérifications",
          description: "Vérification d'identité des utilisateurs",
          icon: <Shield className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          features: ["Upload documents", "Validation admin", "Statut vérification"],
          dependencies: ["verification_requests", "DocumentUpload", "Supabase Storage"]
        },
        {
          name: "Badges System",
          description: "Système de badges et récompenses",
          icon: <Trophy className="h-4 w-4" />,
          type: 'service',
          status: 'active',
          features: ["Gestion badges", "Attribution", "Affichage profil"],
          dependencies: ["badges", "user_badges", "BadgesManagementTab"]
        }
      ]
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
      default:
        return 'bg-gray-100 text-gray-800';
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
                className="w-full justify-start p-2 h-auto"
                onClick={() => hasChildren && toggleExpanded(itemId)}
              >
                <div className="flex items-center gap-2 w-full">
                  {hasChildren ? (
                    isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                  ) : (
                    <div className="w-4" />
                  )}
                  {module.icon}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{module.name}</span>
                      <Badge className={getStatusColor(module.status)} variant="outline">
                        {module.status}
                      </Badge>
                      <Badge className={getTypeColor(module.type)} variant="outline">
                        {module.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    {module.features && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {module.features.map((feature, idx) => (
                          <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs" variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {module.dependencies && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 font-medium">Dépendances: </span>
                        <span className="text-xs text-gray-600">{module.dependencies.join(', ')}</span>
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
            Architecture du Site - Vue Développeur
          </CardTitle>
          <CardDescription>
            Arborescence complète et détaillée de tous les modules qui composent Airsoft Companion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Pages</span>
              </div>
              <p className="text-sm text-blue-700">12 pages principales avec routing complet</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Components</span>
              </div>
              <p className="text-sm text-purple-700">150+ composants réutilisables</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">Database</span>
              </div>
              <p className="text-sm text-green-700">25+ tables Supabase avec RLS</p>
            </div>
          </div>

          <ScrollArea className="h-[800px] w-full">
            <div className="space-y-2">
              {renderModuleTree(siteArchitecture)}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Technologies & Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'React', version: '18.3.1', type: 'Frontend' },
              { name: 'TypeScript', version: 'Latest', type: 'Language' },
              { name: 'Vite', version: 'Latest', type: 'Build Tool' },
              { name: 'Tailwind CSS', version: 'Latest', type: 'Styling' },
              { name: 'Shadcn/ui', version: 'Latest', type: 'UI Library' },
              { name: 'React Query', version: '5.79.2', type: 'State Management' },
              { name: 'React Router', version: '6.26.2', type: 'Routing' },
              { name: 'Supabase', version: '2.49.9', type: 'Backend' },
              { name: 'React Hook Form', version: '7.56.4', type: 'Forms' },
              { name: 'Lucide React', version: '0.462.0', type: 'Icons' },
              { name: 'Date-fns', version: '3.6.0', type: 'Utils' },
              { name: 'Zod', version: '3.25.56', type: 'Validation' }
            ].map((tech, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-semibold">{tech.name}</div>
                <div className="text-sm text-gray-600">{tech.version}</div>
                <Badge className="text-xs mt-1" variant="outline">{tech.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperTab;
