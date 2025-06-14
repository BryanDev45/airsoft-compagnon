
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useVerificationSubmission } from '@/hooks/verification/useVerificationSubmission';
import VerificationDescription from './VerificationDescription';
import DocumentUploadSection from './DocumentUploadSection';

interface VerificationFormProps {
  user: any;
  onVerificationRequested: (request: any) => void;
}

const VerificationForm = ({ user, onVerificationRequested }: VerificationFormProps) => {
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [facePhotoFile, setFacePhotoFile] = useState<File | null>(null);

  const clearFiles = () => {
    setFrontIdFile(null);
    setBackIdFile(null);
    setFacePhotoFile(null);
  };

  const { uploading, handleRequestVerification } = useVerificationSubmission({
    user,
    onVerificationRequested,
    onFilesCleared: clearFiles
  });

  const handleSubmit = () => {
    handleRequestVerification(frontIdFile, backIdFile, facePhotoFile);
  };

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontIdFile(e.target.files[0]);
    }
  };

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackIdFile(e.target.files[0]);
    }
  };

  const handleFacePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFacePhotoFile(e.target.files[0]);
    }
  };

  return (
    <>
      <VerificationDescription />
      
      <DocumentUploadSection
        frontIdFile={frontIdFile}
        backIdFile={backIdFile}
        facePhotoFile={facePhotoFile}
        onFrontIdChange={handleFrontIdChange}
        onBackIdChange={handleBackIdChange}
        onFacePhotoChange={handleFacePhotoChange}
      />
      
      <Button 
        onClick={handleSubmit} 
        className="w-full bg-airsoft-red hover:bg-red-700 mt-4"
        disabled={!frontIdFile || !backIdFile || !facePhotoFile || uploading}
      >
        {uploading ? "Envoi en cours..." : "Demander une vérification"}
      </Button>
    </>
  );
};

export default VerificationForm;
