
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Crosshair, Eye, AlertCircle, Lock } from 'lucide-react';

interface GameEquipmentTabProps {
  aegFpsMin: number | null;
  aegFpsMax: number | null;
  dmrFpsMax: number | null;
  eyeProtectionRequired: boolean | null;
  fullFaceProtectionRequired: boolean | null;
  hasToilets: boolean | null;
  hasParking: boolean | null;
  hasEquipmentRental: boolean | null;
  manualValidation: boolean | null;
  isPrivate: boolean | null;
}

const GameEquipmentTab: React.FC<GameEquipmentTabProps> = ({
  aegFpsMin,
  aegFpsMax,
  dmrFpsMax,
  eyeProtectionRequired,
  fullFaceProtectionRequired,
  hasToilets,
  hasParking,
  hasEquipmentRental,
  manualValidation,
  isPrivate
}) => {
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
              <Badge className="bg-amber-500">{aegFpsMin} - {aegFpsMax} FPS</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Sniper / DMR :</span>
              <Badge className="bg-amber-500">Max {dmrFpsMax} FPS</Badge>
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
              <Badge className={eyeProtectionRequired ? "bg-green-500" : "bg-red-500"}>
                {eyeProtectionRequired ? "Obligatoire" : "Facultative"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-left">Protection intégrale :</span>
              <Badge className={fullFaceProtectionRequired ? "bg-green-500" : "bg-amber-500"}>
                {fullFaceProtectionRequired ? "Obligatoire" : "Recommandée"}
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
              <Badge className={hasToilets ? "bg-green-500" : "bg-red-500"}>
                {hasToilets ? "Disponibles" : "Non disponibles"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Parking :</span>
              <Badge className={hasParking ? "bg-green-500" : "bg-red-500"}>
                {hasParking ? "Disponible" : "Non disponible"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-left">Location de matériel:</span>
              <Badge className={hasEquipmentRental ? "bg-green-500" : "bg-red-500"}>
                {hasEquipmentRental ? "Disponible" : "Non disponible"}
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
              <Badge className={manualValidation ? "bg-amber-500" : "bg-green-500"}>
                {manualValidation ? "Requise" : "Automatique"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Partie privée :</span>
              <Badge className={isPrivate ? "bg-amber-500" : "bg-green-500"}>
                {isPrivate ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameEquipmentTab;
