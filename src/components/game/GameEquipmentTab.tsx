
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Crosshair, Eye, AlertCircle, Lock } from 'lucide-react';
import { GameData } from '@/types/game';

interface GameEquipmentTabProps {
  gameData: GameData;
}

const GameEquipmentTab: React.FC<GameEquipmentTabProps> = ({ gameData }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Équipement et limitations</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Crosshair className="text-airsoft-red mr-2" size={20} />
            Limites de puissance
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center justify-between">
              <span>AEG / GBB :</span>
              <Badge className="bg-amber-500">{gameData.aeg_fps_min} - {gameData.aeg_fps_max} FPS</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Sniper / DMR :</span>
              <Badge className="bg-amber-500">Max {gameData.dmr_fps_max} FPS</Badge>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Eye className="text-airsoft-red mr-2" size={20} />
            Protection
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center justify-between">
              <span>Protection oculaire :</span>
              <Badge className={gameData.eye_protection_required ? "bg-green-500" : "bg-red-500"}>
                {gameData.eye_protection_required ? "Obligatoire" : "Facultative"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-left">Protection intégrale :</span>
              <Badge className={gameData.full_face_protection_required ? "bg-green-500" : "bg-amber-500"}>
                {gameData.full_face_protection_required ? "Obligatoire" : "Recommandée"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <AlertCircle className="text-airsoft-red mr-2" size={20} />
            Services du terrain
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center justify-between">
              <span>Toilettes :</span>
              <Badge className={gameData.has_toilets ? "bg-green-500" : "bg-red-500"}>
                {gameData.has_toilets ? "Disponibles" : "Non disponibles"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Parking :</span>
              <Badge className={gameData.has_parking ? "bg-green-500" : "bg-red-500"}>
                {gameData.has_parking ? "Disponible" : "Non disponible"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-left">Location de matériel:</span>
              <Badge className={gameData.has_equipment_rental ? "bg-green-500" : "bg-red-500"}>
                {gameData.has_equipment_rental ? "Disponible" : "Non disponible"}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Lock className="text-airsoft-red mr-2" size={20} />
            Paramètres de participation
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center justify-between">
              <span>Validation :</span>
              <Badge className={gameData.manual_validation ? "bg-amber-500" : "bg-green-500"}>
                {gameData.manual_validation ? "Requise" : "Automatique"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Partie privée :</span>
              <Badge className={gameData.is_private ? "bg-amber-500" : "bg-green-500"}>
                {gameData.is_private ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameEquipmentTab;
