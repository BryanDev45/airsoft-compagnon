
import React from 'react';
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

const Toolbox = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <ToolboxHeader />

          <Tabs defaultValue="calculators" className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="calculators" className="flex items-center gap-1">
                <Calculator className="h-4 w-4" /> Calculateurs
              </TabsTrigger>
              <TabsTrigger value="discord-bot" className="flex items-center gap-1">
                <Bot className="h-4 w-4" /> Bot Discord
              </TabsTrigger>
              <TabsTrigger value="glossary" className="flex items-center gap-1">
                <Book className="h-4 w-4" /> Glossaire
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex items-center gap-1">
                <Target className="h-4 w-4" /> Scénarios
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex items-center gap-1">
                <Settings className="h-4 w-4" /> Dépannage
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-1">
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
