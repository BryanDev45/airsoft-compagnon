
// Mock data for user profile
export const mockUserData = {
  username: "AirsoftMaster",
  email: "airsoft.master@example.com",
  firstname: "Jean",
  lastname: "Dupont",
  age: "28",
  team: "Les Invincibles",
  teamId: "1",
  location: "Paris, France",
  joinDate: "Avril 2023",
  bio: "Passionné d'airsoft depuis 5 ans, j'organise régulièrement des parties sur Paris et sa région.",
  avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  isVerified: true,
  isTeamLeader: true,
  badges: [
    {
      id: 1,
      name: "Profil Vérifié",
      description: "Ce joueur a vérifié son identité auprès de l'équipe Airsoft Compagnon",
      icon: "/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png",
      backgroundColor: "#e1f7e1",
      borderColor: "#4caf50", 
      date: "15/01/2024"
    },
    {
      id: 2,
      name: "Chef d'équipe",
      description: "Ce joueur est le fondateur ou le leader d'une équipe d'airsoft",
      icon: "/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png",
      backgroundColor: "#fff8e1",
      borderColor: "#ffc107",
      date: "02/02/2024"
    },
    {
      id: 3,
      name: "Organisateur",
      description: "A organisé plus de 5 parties d'airsoft",
      icon: "https://randomuser.me/api/portraits/men/44.jpg",
      backgroundColor: "#e3f2fd",
      borderColor: "#2196f3",
      date: "10/03/2024"
    }
  ],
  games: [
    { 
      id: 1, 
      title: "Opération Blackout", 
      date: "15/05/2025", 
      role: "Participant", 
      status: "À venir",
      location: "Terrain Battlezone, Paris",
      description: "Une partie nocturne avec objectifs tactiques",
      participants: 24,
      duration: "8h",
      gameType: "Milsim"
    },
    { 
      id: 2, 
      title: "CQB Summer Challenge", 
      date: "02/04/2025", 
      role: "Participant", 
      status: "À venir",
      location: "Hangar 34, Marseille",
      description: "Une journée CQB intense avec plusieurs scénarios",
      participants: 36,
      duration: "6h",
      gameType: "CQB"
    },
    { 
      id: 3, 
      title: "Milsim Weekend", 
      date: "10/03/2025", 
      role: "Organisateur", 
      status: "Terminé",
      location: "Forêt de Fontainebleau",
      description: "Week-end simulation militaire avec campement",
      participants: 80,
      duration: "48h",
      gameType: "Milsim"
    },
  ],
  // Added allGames array to mockData
  allGames: [
    { 
      id: 4, 
      title: "Opération Eagle", 
      date: "15/02/2025", 
      role: "Participant", 
      status: "Terminé",
      location: "Terrain Delta Force, Lyon",
      description: "Scénario tactique en équipes",
      participants: 30,
      duration: "5h",
      gameType: "Woodland"
    },
    { 
      id: 5, 
      title: "Urban Warfare", 
      date: "05/01/2025", 
      role: "Participant", 
      status: "Terminé",
      location: "Zone urbaine abandonnée, Lille",
      description: "Simulation de combat urbain",
      participants: 40,
      duration: "7h",
      gameType: "CQB"
    },
    { 
      id: 6, 
      title: "Winter Challenge", 
      date: "20/12/2024", 
      role: "Organisateur", 
      status: "Terminé",
      location: "Forêt des Ardennes",
      description: "Challenge hivernal avec objectifs et missions",
      participants: 60,
      duration: "10h",
      gameType: "Woodland"
    },
  ],
  stats: {
    gamesPlayed: 42,
    gamesOrganized: 7,
    reputation: 4.8,
    level: "Confirmé",
    winRate: "68%",
    objectivesCompleted: 127,
    flagsCaptured: 53,
    vipProtection: 12,
    hostageRescue: 8,
    bombDefusal: 15,
    timePlayed: "312h",
    favoriteRole: "Assaut",
    preferredGameType: "Milsim",
    teamwork: "Excellent",
    tacticalAwareness: "Élevé",
    accuracy: "76%"
  },
  equipment: [
    { 
      id: 1, 
      type: "Fusil d'assaut", 
      brand: "G&G", 
      power: "330 FPS", 
      description: "G&G CM16 Raider 2.0 avec red dot et grip vertical",
      image: "https://randomuser.me/api/portraits/men/44.jpg" // placeholder image
    }
  ]
};

export const equipmentTypes = [
  "DMR", 
  "SMG", 
  "PA", 
  "Mitrailleuse", 
  "Fusil d'assaut", 
  "Fusil de précision", 
  "Fusil à pompe"
];
