
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Book, Target, Settings, Info, Bot } from 'lucide-react';
import FpsJouleCalculator from '../components/toolbox/FpsJouleCalculator';
import BatteryCalculator from '../components/toolbox/BatteryCalculator';
import AirsoftGlossary from '../components/toolbox/AirsoftGlossary';
import AirsoftScenarios from '../components/toolbox/AirsoftScenarios';
import TroubleshootingGuide from '../components/toolbox/TroubleshootingGuide';
import ToolboxHeader from '../components/toolbox/ToolboxHeader';
import GearRatioCalculator from '../components/toolbox/GearRatioCalculator';
import ElectricalCompatibilityCalculator from '../components/toolbox/ElectricalCompatibilityCalculator';
import GuidesTab from '../components/toolbox/GuidesTab';
import DiscordBotTab from '../components/toolbox/DiscordBotTab';
import { useTabAnalytics } from '../hooks/usePageAnalytics';

const Toolbox = () => {
  const { activeTab: urlActiveTab } = useParams();
  const [activeTab, setActiveTab] = useState(urlActiveTab || "calculators");

  // Tracker les visites des onglets de la boîte à outils
  useTabAnalytics(activeTab, '/toolbox');

  // Mettre à jour l'onglet actif si l'URL change
  useEffect(() => {
    if (urlActiveTab) {
      setActiveTab(urlActiveTab);
    }
  }, [urlActiveTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <ToolboxHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full justify-start h-auto min-h-[48px] p-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto scrollbar-thin">
              <TabsTrigger value="calculators" className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
                <Calculator className="h-4 w-4" /> Calculateurs
              </TabsTrigger>
              <TabsTrigger value="discord-bot" className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
                <Bot className="h-4 w-4" /> Bot Discord
              </TabsTrigger>
              <TabsTrigger value="glossary" className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
                <Book className="h-4 w-4" /> Glossaire
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
                <Target className="h-4 w-4" /> Scénarios
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
                <Settings className="h-4 w-4" /> Dépannage
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
                <Info className="h-4 w-4" /> Guides
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculators">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FpsJouleCalculator />
                <BatteryCalculator />
                <GearRatioCalculator />
                <ElectricalCompatibilityCalculator />
              </div>
            </TabsContent>

            <TabsContent value="discord-bot">
              <DiscordBotTab />
            </TabsContent>

            <TabsContent value="glossary">
              <AirsoftGlossary />
            </TabsContent>

            <TabsContent value="scenarios">
              <AirsoftScenarios />
            </TabsContent>

            <TabsContent value="troubleshooting">
              <TroubleshootingGuide />
            </TabsContent>

            <TabsContent value="guides">
              <GuidesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Toolbox;
