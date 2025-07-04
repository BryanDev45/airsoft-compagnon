import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronRight, Code, Database, Globe, Layers, Settings, Users, MessageSquare, Shield, Gamepad2, Store, Trophy, FileText, Search, Bell, GitBranch, Server, Key, Zap, AlertCircle, Info, ArrowRight, Package, Download, Copy, Bookmark, BookmarkCheck, Moon, Sun, ExternalLink, Activity, BarChart3, Lock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
interface CodeExample {
  title: string;
  code: string;
  language: string;
  category?: 'basic' | 'advanced' | 'integration';
}
interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response?: {
    type: string;
    description: string;
  };
  example?: string;
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
  apis?: APIEndpoint[];
}
const DeveloperTab = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("architecture");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const toggleBookmark = (id: string) => {
    setBookmarkedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    toast({
      title: bookmarkedItems.includes(id) ? "Signet supprimé" : "Signet ajouté",
      description: bookmarkedItems.includes(id) ? "Element retiré des signets" : "Element ajouté aux signets"
    });
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Code copié dans le presse-papiers"
    });
  };
  const exportToPDF = () => {
    toast({
      title: "Export PDF",
      description: "Fonctionnalité d'export PDF en cours de développement"
    });
  };

  // Performance metrics data
  const performanceMetrics = {
    bundleSize: "2.1 MB",
    loadTime: "1.2s",
    firstContentfulPaint: "0.8s",
    largestContentfulPaint: "1.1s",
    cumulativeLayoutShift: "0.05",
    interactions: "98ms"
  };

  // Security guidelines
  const securityGuidelines = [{
    title: "Authentification & Sessions",
    items: ["Utilisation de JWT avec rotation automatique", "Sessions sécurisées avec httpOnly cookies", "Validation côté serveur pour toutes les requêtes", "Rate limiting sur les endpoints sensibles"]
  }, {
    title: "Protection des Données",
    items: ["Chiffrement des données sensibles en base", "RLS (Row Level Security) sur toutes les tables", "Validation d'entrée stricte avec Zod", "Sanitisation des données avant stockage"]
  }, {
    title: "Infrastructure",
    items: ["HTTPS obligatoire en production", "Headers de sécurité CSP configurés", "Backup automatique des données", "Monitoring des accès et anomalies"]
  }];

  // API Documentation
  const apiDocumentation: APIEndpoint[] = [{
    method: 'GET',
    path: '/api/games',
    description: 'Récupère la liste des parties d\'airsoft',
    parameters: [{
      name: 'page',
      type: 'number',
      required: false,
      description: 'Numéro de page'
    }, {
      name: 'limit',
      type: 'number',
      required: false,
      description: 'Nombre d\'éléments par page'
    }, {
      name: 'city',
      type: 'string',
      required: false,
      description: 'Filtrer par ville'
    }],
    response: {
      type: 'Game[]',
      description: 'Liste des parties'
    },
    example: `{
  "data": [
    {
      "id": "uuid",
      "title": "Op. Tempête du Désert",
      "date": "2024-07-15",
      "city": "Lyon",
      "max_players": 50
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 10
  }
}`
  }, {
    method: 'POST',
    path: '/api/games',
    description: 'Crée une nouvelle partie d\'airsoft',
    parameters: [{
      name: 'title',
      type: 'string',
      required: true,
      description: 'Nom de la partie'
    }, {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Description détaillée'
    }, {
      name: 'date',
      type: 'string',
      required: true,
      description: 'Date au format ISO'
    }, {
      name: 'max_players',
      type: 'number',
      required: true,
      description: 'Nombre maximum de joueurs'
    }],
    response: {
      type: 'Game',
      description: 'Partie créée'
    }
  }, {
    method: 'GET',
    path: '/api/teams/:id',
    description: 'Récupère les détails d\'une équipe',
    parameters: [{
      name: 'id',
      type: 'uuid',
      required: true,
      description: 'ID de l\'équipe'
    }],
    response: {
      type: 'Team',
      description: 'Détails de l\'équipe'
    }
  }, {
    method: 'POST',
    path: '/api/messages',
    description: 'Envoie un message dans une conversation',
    parameters: [{
      name: 'conversation_id',
      type: 'uuid',
      required: true,
      description: 'ID de la conversation'
    }, {
      name: 'content',
      type: 'string',
      required: true,
      description: 'Contenu du message'
    }],
    response: {
      type: 'Message',
      description: 'Message créé'
    }
  }];
  const siteArchitecture: ModuleInfo[] = [{
    name: "Système d'Authentification",
    description: "Architecture complète d'authentification avec Supabase Auth, gestion des sessions et protection des routes",
    icon: <Shield className="h-4 w-4" />,
    type: 'service',
    status: 'active',
    complexity: 'high',
    dependencies: [{
      name: "@supabase/supabase-js",
      type: 'import',
      description: "Client Supabase pour l'authentification et les sessions",
      required: true,
      version: "^2.49.9",
      path: "src/integrations/supabase/client.ts"
    }, {
      name: "@tanstack/react-query",
      type: 'import',
      description: "Cache et synchronisation des données d'authentification",
      required: true,
      version: "^5.79.2"
    }, {
      name: "React Context API",
      type: 'service',
      description: "Partage de l'état d'authentification global",
      required: true
    }],
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
    codeExamples: [{
      title: "Hook d'authentification basique",
      language: "typescript",
      category: "basic",
      code: `const { user, login, logout, loading } = useAuth();

if (loading) return <Loading />;
if (!user) return <LoginForm />;

return <Dashboard user={user} />;`
    }, {
      title: "Protection de routes",
      language: "typescript",
      category: "advanced",
      code: `const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, initialLoading } = useAuth();
  
  if (initialLoading) return <LoadingSpinner />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};`
    }, {
      title: "Authentification sociale",
      language: "typescript",
      category: "integration",
      code: `const { signInWithOAuth } = useSocialAuth();

const handleGoogleSignIn = async () => {
  try {
    await signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  } catch (error) {
    toast.error('Erreur lors de la connexion');
  }
};`
    }],
    apis: [{
      method: 'POST',
      path: '/auth/login',
      description: 'Connexion utilisateur avec email/mot de passe',
      parameters: [{
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email de l\'utilisateur'
      }, {
        name: 'password',
        type: 'string',
        required: true,
        description: 'Mot de passe'
      }],
      response: {
        type: 'AuthResponse',
        description: 'Session et données utilisateur'
      }
    }, {
      method: 'POST',
      path: '/auth/register',
      description: 'Inscription nouvel utilisateur',
      parameters: [{
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email unique'
      }, {
        name: 'password',
        type: 'string',
        required: true,
        description: 'Mot de passe (min 8 caractères)'
      }, {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Nom d\'utilisateur unique'
      }],
      response: {
        type: 'AuthResponse',
        description: 'Confirmation d\'inscription'
      }
    }]
  }, {
    name: "Système de Messagerie",
    description: "Messagerie temps réel avec Supabase Realtime, conversations d'équipe et messages privés",
    icon: <MessageSquare className="h-4 w-4" />,
    type: 'service',
    status: 'active',
    complexity: 'high',
    dependencies: [{
      name: "@supabase/supabase-js",
      type: 'import',
      description: "Client Supabase pour les subscriptions temps réel",
      required: true,
      version: "^2.49.9"
    }, {
      name: "@tanstack/react-query",
      type: 'import',
      description: "Cache et mutations pour les messages",
      required: true,
      version: "^5.79.2"
    }],
    technicalDetails: {
      filePath: "src/components/messaging/",
      mainExports: ["MessagingIcon", "ChatView", "ConversationList"],
      stateManagement: "React Query + Optimistic Updates",
      databaseTables: ["conversations", "messages", "conversation_participants"],
      realTimeFeatures: ["Live messages", "Typing indicators", "Online presence"],
      cacheStrategy: "Infinite query avec optimistic updates",
      errorHandling: "Retry logic + offline support"
    },
    codeExamples: [{
      title: "Envoi de message avec optimistic update",
      language: "typescript",
      category: "advanced",
      code: `const { sendMessage } = useMessageActions(conversationId);

const handleSend = async (content: string) => {
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
    showErrorToast('Échec de l\'envoi');
  }
};`
    }, {
      title: "Subscription temps réel",
      language: "typescript",
      category: "integration",
      code: `useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, handleNewMessage)
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [conversationId]);`
    }]
  }, {
    name: "Système de Jeux",
    description: "Gestion complète des parties d'airsoft avec géolocalisation, inscriptions et commentaires",
    icon: <Gamepad2 className="h-4 w-4" />,
    type: 'service',
    status: 'active',
    complexity: 'high',
    dependencies: [{
      name: "react-hook-form",
      type: 'import',
      description: "Gestion des formulaires de création/édition",
      required: true,
      version: "^7.56.4"
    }, {
      name: "zod",
      type: 'import',
      description: "Validation des schémas de jeu",
      required: true,
      version: "^3.25.56"
    }, {
      name: "mapbox-gl",
      type: 'import',
      description: "Cartes pour la localisation des jeux",
      required: true,
      version: "^3.11.0"
    }],
    technicalDetails: {
      filePath: "src/pages/",
      mainExports: ["GameDetails", "CreateParty", "EditGame"],
      databaseTables: ["airsoft_games", "game_participants", "game_comments"],
      stateManagement: "React Query + React Hook Form",
      cacheStrategy: "Aggressive caching avec background refetch",
      errorHandling: "Form validation + server error handling"
    },
    codeExamples: [{
      title: "Validation de formulaire de jeu",
      language: "typescript",
      category: "basic",
      code: `const gameSchema = z.object({
  title: z.string().min(5, "Titre trop court"),
  date: z.string().refine(date => new Date(date) > new Date(), "Date invalide"),
  max_players: z.number().min(6).max(200),
  city: z.string().min(2),
  description: z.string().min(20)
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(gameSchema)
});`
    }]
  }, {
    name: "Système d'Équipes",
    description: "Gestion des équipes d'airsoft avec hiérarchie, invitations et actualités",
    icon: <Users className="h-4 w-4" />,
    type: 'service',
    status: 'active',
    complexity: 'medium',
    technicalDetails: {
      filePath: "src/components/team/",
      mainExports: ["TeamView", "TeamSettings", "TeamMembers"],
      databaseTables: ["teams", "team_members", "team_invitations", "team_news"],
      stateManagement: "React Query avec mutations",
      cacheStrategy: "Team data cached pour 10min",
      errorHandling: "Validation permissions + rollback"
    }
  }, {
    name: "Système de Notifications",
    description: "Notifications en temps réel pour toutes les interactions",
    icon: <Bell className="h-4 w-4" />,
    type: 'service',
    status: 'active',
    complexity: 'medium',
    technicalDetails: {
      filePath: "src/hooks/useNotifications.tsx",
      mainExports: ["useNotifications", "NotificationList"],
      databaseTables: ["notifications"],
      realTimeFeatures: ["Live notifications", "Push notifications"],
      cacheStrategy: "Real-time updates avec cache local"
    }
  }];

  // Filter and search functionality
  const filteredArchitecture = useMemo(() => {
    if (!searchQuery && selectedCategory === "all") return siteArchitecture;
    return siteArchitecture.filter(module => {
      const matchesSearch = searchQuery === "" || module.name.toLowerCase().includes(searchQuery.toLowerCase()) || module.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || module.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, siteArchitecture]);
  const CodeBlock = ({
    code,
    language,
    title
  }: {
    code: string;
    language: string;
    title: string;
  }) => <div className={`relative rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="text-sm font-medium">{title}</span>
          <Badge variant="outline" className="text-xs">{language}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)} className="h-8 w-8 p-0">
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <ScrollArea className="max-h-64">
        <pre className={`p-4 text-sm overflow-x-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>;
  const ModuleCard = ({
    module,
    depth = 0
  }: {
    module: ModuleInfo;
    depth?: number;
  }) => {
    const isExpanded = expandedItems.includes(module.name);
    const isBookmarked = bookmarkedItems.includes(module.name);
    const hasChildren = module.children && module.children.length > 0;
    return <Card className={`mb-4 ${depth > 0 ? 'ml-6 border-l-2 border-l-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10">
                {module.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <Badge variant={module.status === 'active' ? 'default' : module.status === 'beta' ? 'secondary' : 'destructive'}>
                    {module.status}
                  </Badge>
                  <Badge variant="outline">
                    {module.complexity}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleBookmark(module.name)} className="h-8 w-8 p-0">
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
              {(hasChildren || module.codeExamples?.length || module.technicalDetails) && <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(module.name)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>}
            </div>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(module.name)}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* Technical Details */}
              {module.technicalDetails && <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Détails Techniques
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {module.technicalDetails.filePath && <div>
                        <span className="font-medium">Chemin:</span>
                        <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                          {module.technicalDetails.filePath}
                        </code>
                      </div>}
                    {module.technicalDetails.stateManagement && <div>
                        <span className="font-medium">State Management:</span>
                        <span className="ml-2">{module.technicalDetails.stateManagement}</span>
                      </div>}
                    {module.technicalDetails.cacheStrategy && <div>
                        <span className="font-medium">Cache:</span>
                        <span className="ml-2">{module.technicalDetails.cacheStrategy}</span>
                      </div>}
                    {module.technicalDetails.errorHandling && <div>
                        <span className="font-medium">Gestion d'erreurs:</span>
                        <span className="ml-2">{module.technicalDetails.errorHandling}</span>
                      </div>}
                    {module.technicalDetails.databaseTables && <div className="md:col-span-2">
                        <span className="font-medium">Tables DB:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {module.technicalDetails.databaseTables.map((table, i) => <Badge key={i} variant="outline" className="text-xs">
                              {table}
                            </Badge>)}
                        </div>
                      </div>}
                    {module.technicalDetails.realTimeFeatures && <div className="md:col-span-2">
                        <span className="font-medium">Features Temps Réel:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {module.technicalDetails.realTimeFeatures.map((feature, i) => <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>)}
                        </div>
                      </div>}
                  </div>
                </div>}

              {/* Dependencies */}
              {module.dependencies && module.dependencies.length > 0 && <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Dépendances
                  </h4>
                  <div className="space-y-2">
                    {module.dependencies.map((dep, i) => <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-medium">{dep.name}</code>
                            {dep.version && <Badge variant="outline" className="text-xs">{dep.version}</Badge>}
                            <Badge variant={dep.required ? 'destructive' : 'secondary'} className="text-xs">
                              {dep.required ? 'Requis' : 'Optionnel'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{dep.description}</p>
                          {dep.path && <code className="text-xs text-muted-foreground">{dep.path}</code>}
                        </div>
                      </div>)}
                  </div>
                </div>}

              {/* Code Examples */}
              {module.codeExamples && module.codeExamples.length > 0 && <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Exemples de Code
                  </h4>
                  <div className="space-y-4">
                    {module.codeExamples.map((example, i) => <CodeBlock key={i} code={example.code} language={example.language} title={example.title} />)}
                  </div>
                </div>}

              {/* API Endpoints */}
              {module.apis && module.apis.length > 0 && <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    API Endpoints
                  </h4>
                  <div className="space-y-3">
                    {module.apis.map((api, i) => <div key={i} className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={api.method === 'GET' ? 'secondary' : api.method === 'POST' ? 'default' : 'destructive'}>
                            {api.method}
                          </Badge>
                          <code className="text-sm font-mono">{api.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                        
                        {api.parameters && api.parameters.length > 0 && <div className="mb-3">
                            <h5 className="text-xs font-semibold mb-2">Paramètres:</h5>
                            <div className="space-y-1">
                              {api.parameters.map((param, j) => <div key={j} className="text-xs">
                                  <code className="font-mono">{param.name}</code>
                                  <span className="text-muted-foreground"> ({param.type})</span>
                                  {param.required && <span className="text-red-500 ml-1">*</span>}
                                  <span className="text-muted-foreground ml-2">- {param.description}</span>
                                </div>)}
                            </div>
                          </div>}

                        {api.response && <div className="mb-3">
                            <h5 className="text-xs font-semibold mb-1">Réponse:</h5>
                            <div className="text-xs">
                              <code className="font-mono">{api.response.type}</code>
                              <span className="text-muted-foreground ml-2">- {api.response.description}</span>
                            </div>
                          </div>}

                        {api.example && <div>
                            <h5 className="text-xs font-semibold mb-2">Exemple:</h5>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              <code>{api.example}</code>
                            </pre>
                          </div>}
                      </div>)}
                  </div>
                </div>}

              {/* Children Modules */}
              {hasChildren && <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Sous-modules
                  </h4>
                  <div className="space-y-4">
                    {module.children!.map((child, i) => <ModuleCard key={i} module={child} depth={depth + 1} />)}
                  </div>
                </div>}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>;
  };
  return <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documentation Développeur</h2>
          <p className="text-muted-foreground">
            Documentation technique complète de l'application Airsoft Companion
          </p>
        </div>
        
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher dans la documentation..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'service', 'component', 'hook', 'database'].map(category => <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)} className="capitalize">
                  {category === 'all' ? 'Tous' : category}
                </Button>)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Base de Données</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Déploiement</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-6">
          {/* Architecture Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Diagramme d'Architecture
              </CardTitle>
              <CardDescription>
                Vue d'ensemble de l'architecture système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted/50 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <div className="mb-4">
                    <pre className="text-left text-sm">
                    {`┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │   External      │
│   (React)       │    │   Backend        │    │   Services      │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ • Auth Context  │◄──►│ • Auth Service   │    │ • Google OAuth  │
│ • React Query   │    │ • Database       │    │ • Discord OAuth │
│ • Zustand       │    │ • Realtime       │    │ • Mapbox        │
│ • React Router  │    │ • Storage        │    │ • Email Service │
│ • Form Handling │    │ • Edge Functions │    │ • Push Notifs   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌──────────────▼──────────────┐
                    │      User Interface         │
                    │  • Games Management         │
                    │  • Team Management          │
                    │  • Messaging System         │
                    │  • User Profiles            │
                    │  • Admin Dashboard          │
                    └─────────────────────────────┘`}
                    </pre>
                  </div>
                  <p className="text-sm">
                    Architecture modulaire avec séparation claire des responsabilités
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookmarked items */}
          {bookmarkedItems.length > 0 && <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookmarkCheck className="h-5 w-5" />
                  Signets ({bookmarkedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {bookmarkedItems.map(item => <Badge key={item} variant="secondary" className="cursor-pointer">
                      {item}
                    </Badge>)}
                </div>
              </CardContent>
            </Card>}

          {/* Architecture modules */}
          <div className="space-y-4">
            {filteredArchitecture.map((module, index) => <ModuleCard key={index} module={module} />)}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Documentation API
              </CardTitle>
              <CardDescription>
                Endpoints disponibles et leur utilisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiDocumentation.map((endpoint, i) => <div key={i} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : endpoint.method === 'POST' ? 'default' : 'destructive'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                    
                    {endpoint.parameters && endpoint.parameters.length > 0 && <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Paramètres:</h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param, j) => <div key={j} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                              <div className="flex items-center gap-2">
                                <code className="font-mono">{param.name}</code>
                                <Badge variant="outline" className="text-xs">{param.type}</Badge>
                                {param.required && <Badge variant="destructive" className="text-xs">Requis</Badge>}
                              </div>
                              <span className="text-muted-foreground">{param.description}</span>
                            </div>)}
                        </div>
                      </div>}

                    {endpoint.response && <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Réponse:</h4>
                        <div className="p-2 bg-muted/50 rounded text-sm">
                          <code className="font-mono">{endpoint.response.type}</code>
                          <span className="text-muted-foreground ml-2">- {endpoint.response.description}</span>
                        </div>
                      </div>}

                    {endpoint.example && <div>
                        <h4 className="text-sm font-semibold mb-2">Exemple de réponse:</h4>
                        <CodeBlock code={endpoint.example} language="json" title="Response Example" />
                      </div>}
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Schéma de Base de Données
              </CardTitle>
              <CardDescription>
                Structure des tables et relations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Database Schema Diagram */}
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-4">Diagramme ERD Simplifié</h4>
                  <div className="text-sm">
                    <pre className="whitespace-pre-wrap font-mono">
                    {`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    profiles     │    │     teams       │    │  airsoft_games  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ username        │    │ name            │    │ title           │
│ email           │    │ description     │    │ description     │
│ team_id (FK)    │◄──►│ leader_id (FK)  │    │ created_by (FK) │
│ is_verified     │    │ member_count    │    │ date            │
│ reputation      │    │ rating          │    │ max_players     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  conversations  │    │  team_members   │    │ game_participants│
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ type            │    │ team_id (FK)    │    │ game_id (FK)    │
│ team_id (FK)    │    │ user_id (FK)    │    │ user_id (FK)    │
│ created_at      │    │ role            │    │ status          │
└─────────────────┘    │ status          │    │ role            │
         │              └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│    messages     │
├─────────────────┤
│ id (PK)         │
│ conversation_id │
│ sender_id (FK)  │
│ content         │
│ created_at      │
└─────────────────┘`}
                    </pre>
                  </div>
                </div>

                {/* Main Tables */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tables Principales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <code className="font-mono font-semibold">profiles</code>
                          <p className="text-muted-foreground">Données utilisateur et profils publics</p>
                        </div>
                        <div>
                          <code className="font-mono font-semibold">airsoft_games</code>
                          <p className="text-muted-foreground">Parties d'airsoft organisées</p>
                        </div>
                        <div>
                          <code className="font-mono font-semibold">teams</code>
                          <p className="text-muted-foreground">Équipes et associations</p>
                        </div>
                        <div>
                          <code className="font-mono font-semibold">conversations</code>
                          <p className="text-muted-foreground">Conversations de messagerie</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tables de Relations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <code className="font-mono font-semibold">game_participants</code>
                          <p className="text-muted-foreground">Inscriptions aux parties</p>
                        </div>
                        <div>
                          <code className="font-mono font-semibold">team_members</code>
                          <p className="text-muted-foreground">Membres des équipes</p>
                        </div>
                        <div>
                          <code className="font-mono font-semibold">friendships</code>
                          <p className="text-muted-foreground">Relations d'amitié</p>
                        </div>
                        <div>
                          <code className="font-mono font-semibold">user_ratings</code>
                          <p className="text-muted-foreground">Système de notation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* RLS Policies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Politiques RLS (Row Level Security)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/50 rounded">
                        <h4 className="font-semibold text-sm mb-2">profiles</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Lecture: Tous les profils publics</li>
                          <li>• Modification: Utilisateur propriétaire uniquement</li>
                          <li>• Données sensibles: Accès restreint aux admins</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <h4 className="font-semibold text-sm mb-2">messages</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Lecture: Participants de la conversation uniquement</li>
                          <li>• Écriture: Utilisateurs authentifiés</li>
                          <li>• Suppression: Auteur du message uniquement</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <h4 className="font-semibold text-sm mb-2">airsoft_games</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Lecture: Jeux publics pour tous</li>
                          <li>• Modification: Créateur ou admins</li>
                          <li>• Jeux privés: Participants uniquement</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Métriques de Performance
              </CardTitle>
              <CardDescription>
                Indicateurs de performance de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(performanceMetrics).map(([key, value]) => <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                          <p className="text-2xl font-bold">{value}</p>
                        </div>
                        <Activity className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>)}
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">Optimisations Mises en Place</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Frontend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          Code splitting automatique avec Vite
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          Optimistic updates pour les mutations
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          Images lazy loading avec intersection observer
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          Cache intelligent avec React Query
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Backend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          Index optimisés sur les requêtes fréquentes
                        </li>
                        <li className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          Connection pooling Supabase
                        </li>
                        <li className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          Triggers optimisés pour les agrégations
                        </li>
                        <li className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          CDN pour les assets statiques
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Directives de Sécurité
              </CardTitle>
              <CardDescription>
                Mesures de sécurité implémentées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {securityGuidelines.map((section, i) => <Card key={i}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.items.map((item, j) => <li key={j} className="flex items-start gap-2 text-sm">
                            <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>)}
                      </ul>
                    </CardContent>
                  </Card>)}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Audit de Sécurité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-300">Authentification</span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">Sécurisé ✓</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-300">Base de Données</span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">RLS Activé ✓</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-300">API</span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">Rate Limited ✓</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Guide de Déploiement
              </CardTitle>
              <CardDescription>
                Instructions pour le déploiement en production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prérequis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Node.js 18+ et npm/yarn
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Compte Supabase configuré
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Variables d'environnement configurées
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Certificat SSL valide
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Étapes de Déploiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">1. Build de Production</h4>
                        <CodeBlock code={`# Installation des dépendances
npm install

# Build optimisé pour la production
npm run build

# Test du build en local
npm run preview`} language="bash" title="Commands de Build" />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">2. Configuration Supabase</h4>
                        <CodeBlock code={`# Déploiement des migrations
supabase db push

# Déploiement des edge functions
supabase functions deploy

# Configuration des buckets storage
supabase storage create-bucket --public profile_images`} language="bash" title="Supabase Deployment" />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">3. Variables d'Environnement</h4>
                        <CodeBlock code={`# Variables requises en production
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Optionnelles
VITE_APP_ENV=production
VITE_SENTRY_DSN=your-sentry-dsn`} language="bash" title="Environment Variables" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monitoring & Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Surveillance</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Monitoring Supabase Dashboard</li>
                          <li>• Logs des Edge Functions</li>
                          <li>• Métriques de performance</li>
                          <li>• Alertes d'erreur</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Maintenance</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Backup automatique des données</li>
                          <li>• Mise à jour des dépendances</li>
                          <li>• Rotation des clés API</li>
                          <li>• Nettoyage des logs anciens</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default DeveloperTab;