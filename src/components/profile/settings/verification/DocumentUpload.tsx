
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera } from 'lucide-react';

interface DocumentUploadProps {
  id: string;
  label: string;
  icon: 'upload' | 'camera';
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  accept?: string;
  capture?: string;
}

const DocumentUpload = ({ 
  id, 
  label, 
  icon, 
  file, 
  onChange, 
  placeholder, 
  accept = "image/*",
  capture 
}: DocumentUploadProps) => {
  const triggerFileInput = () => {
    document.getElementById(id)?.click();
  };

  const IconComponent = icon === 'camera' ? Camera : Upload;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1">
        <IconComponent size={16} /> {label}
      </Label>
      <div className="border border-dashed border-gray-300 rounded-md p-4">
        <Input 
          id={id}
          type="file" 
          accept={accept}
          onChange={onChange}
          className="hidden"
          {...(capture && { capture })}
        />
        <div 
          onClick={triggerFileInput}
          className="cursor-pointer text-center py-4"
        >
          <IconComponent className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {file ? file.name : placeholder}
          </p>
        </div>
        {file && (
          <p className="text-xs text-gray-500 mt-2">
            {file.name} ({Math.round(file.size / 1024)} Ko)
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
