
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from 'lucide-react';

interface ProfileEditableFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => Promise<boolean>;
  onCancel: () => void;
  isOwnProfile: boolean;
  inputType?: string;
}

const ProfileEditableField: React.FC<ProfileEditableFieldProps> = ({
  icon,
  label,
  value,
  placeholder,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isOwnProfile,
  inputType = "text"
}) => {
  const [editValue, setEditValue] = useState(value);

  const handleSave = async () => {
    const success = await onSave(editValue);
    if (!success) {
      setEditValue(value); // Reset on failure
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    onCancel();
  };

  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <div className="flex items-start">
      <div className="h-5 w-5 text-gray-500 mr-3 mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm text-gray-500">{label}</span>
        {isOwnProfile && isEditing ? (
          <div className="mt-1 space-y-2">
            <Input
              type={inputType}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="w-full"
            />
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="font-medium">
              {value || 'Non spécifié'}
            </p>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEditableField;
