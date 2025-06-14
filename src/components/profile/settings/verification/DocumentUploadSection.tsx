
import React from 'react';
import DocumentUpload from './DocumentUpload';

interface DocumentUploadSectionProps {
  frontIdFile: File | null;
  backIdFile: File | null;
  facePhotoFile: File | null;
  onFrontIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFacePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUploadSection = ({
  frontIdFile,
  backIdFile,
  facePhotoFile,
  onFrontIdChange,
  onBackIdChange,
  onFacePhotoChange
}: DocumentUploadSectionProps) => {
  return (
    <div className="space-y-4 mt-4">
      <DocumentUpload
        id="front-id"
        label="Recto de votre carte d'identité"
        icon="upload"
        file={frontIdFile}
        onChange={onFrontIdChange}
        placeholder="Cliquez pour télécharger le recto"
      />
      
      <DocumentUpload
        id="back-id"
        label="Verso de votre carte d'identité"
        icon="upload"
        file={backIdFile}
        onChange={onBackIdChange}
        placeholder="Cliquez pour télécharger le verso"
      />

      <DocumentUpload
        id="face-photo"
        label="Photo de votre visage"
        icon="camera"
        file={facePhotoFile}
        onChange={onFacePhotoChange}
        placeholder="Cliquez pour prendre une photo ou sélectionner depuis la galerie"
        capture="user"
      />
    </div>
  );
};

export default DocumentUploadSection;
