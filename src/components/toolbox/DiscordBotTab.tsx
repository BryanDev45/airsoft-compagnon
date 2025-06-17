
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Bot, Shield, Bell, Server, ExternalLink } from 'lucide-react';
import { incrementDiscordBotDownloads, incrementDiscordBotInvites } from '@/utils/analyticsUtils';

const DiscordBotTab = () => {
  const handleDownloadBot = async () => {
    // Incrémenter les statistiques avant de déclencher le téléchargement
    await incrementDiscordBotDownloads();
    
    // Créer un lien de téléchargement vers le fichier du bot
    const link = document.createElement('a');
    link.href = '/bot-discord.zip'; // Le fichier sera placé dans le dossier public
    link.download = 'airsoft-tracker-bot.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInviteBot = async () => {
    // Incrémenter les statistiques avant d'ouvrir le lien
    await incrementDiscordBotInvites();
    
    // Ouvrir le lien d'invitation du bot (à remplacer par le vrai lien)
    window.open('https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=2048&scope=bot', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Bot Discord Airsoft</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Restez informé des nouvelles parties d'airsoft directement sur votre serveur Discord ! 
          Notre bot vous notifie automatiquement lorsque de nouvelles parties sont publiées.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fonctionnalités */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Fonctionnalités du Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Notifications automatiques</h4>
                  <p className="text-sm text-gray-600">Recevez des alertes pour chaque nouvelle partie publiée</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Server className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Filtres par région</h4>
                  <p className="text-sm text-gray-600">Configurez le bot pour suivre uniquement certaines régions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Liens directs</h4>
                  <p className="text-sm text-gray-600">Accédez directement aux détails des parties depuis Discord</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Gratuit</Badge>
                <Badge variant="secondary">Open Source</Badge>
                <Badge variant="secondary">Facile à installer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Installation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Option 1 : Bot hébergé</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Invitez notre bot officiel sur votre serveur (recommandé)
                </p>
                <Button 
                  onClick={handleInviteBot}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Inviter le Bot
                </Button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Option 2 : Auto-hébergement</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Téléchargez et hébergez le bot sur votre propre serveur
                </p>
                <Button 
                  onClick={handleDownloadBot}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le Bot
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2">Configuration requise :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Node.js 18+ (pour l'auto-hébergement)</li>
                <li>• Permissions "Envoyer des messages" sur Discord</li>
                <li>• Canal dédié recommandé</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guide d'installation */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Guide d'installation rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold mb-2">Inviter le bot</h4>
              <p className="text-sm text-gray-600">
                Cliquez sur "Inviter le Bot" et sélectionnez votre serveur Discord
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold mb-2">Configurer</h4>
              <p className="text-sm text-gray-600">
                Utilisez <code className="bg-gray-100 px-1 rounded">/setup</code> pour configurer le canal et les filtres
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold mb-2">Profiter</h4>
              <p className="text-sm text-gray-600">
                Recevez automatiquement les notifications des nouvelles parties !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Besoin d'aide ?</h3>
            <p className="text-gray-600 mb-4">
              Notre équipe de support est là pour vous aider avec l'installation et la configuration du bot.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Server className="h-4 w-4 mr-2" />
                Serveur Support Discord
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscordBotTab;
