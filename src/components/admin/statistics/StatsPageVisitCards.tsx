
import { 
  Users, 
  Calendar, 
  Wrench, 
  User, 
  UsersRound 
} from 'lucide-react';

export const createPageVisitCards = (stats: any) => [
  {
    title: 'Page d\'accueil',
    value: stats?.homePageVisits || 0,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Page parties',
    value: stats?.partiesPageVisits || 0,
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Boîte à outils',
    value: stats?.toolboxPageVisits || 0,
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Page profil',
    value: stats?.profilePageVisits || 0,
    icon: User,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Page équipe',
    value: stats?.teamPageVisits || 0,
    icon: UsersRound,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];

export const createSearchTabVisitCards = (stats: any) => [
  {
    title: 'Onglet Parties',
    value: stats?.partiesTabVisits || 0,
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Onglet Joueurs',
    value: stats?.joueursTabVisits || 0,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Onglet Équipes',
    value: stats?.equipesTabVisits || 0,
    icon: UsersRound,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Onglet Magasins',
    value: stats?.magasinsTabVisits || 0,
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export const createToolboxVisitCards = (stats: any) => [
  {
    title: 'Calculateurs',
    value: stats?.toolboxCalculatorsVisits || 0,
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Bot Discord',
    value: stats?.toolboxDiscordBotVisits || 0,
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Glossaire',
    value: stats?.toolboxGlossaryVisits || 0,
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Scénarios',
    value: stats?.toolboxScenariosVisits || 0,
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Dépannage',
    value: stats?.toolboxTroubleshootingVisits || 0,
    icon: Wrench,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Guides',
    value: stats?.toolboxGuidesVisits || 0,
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];
