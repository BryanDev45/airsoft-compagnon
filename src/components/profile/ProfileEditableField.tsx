import React, { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [tempValue, setTempValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(tempValue);
    setIsSaving(false);
  };
  const handleCancel = () => {
    setTempValue(value);
    onCancel();
  };
  if (isEditing) {
    return <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5 text-gray-500">
          {icon}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <span className="text-sm text-gray-500 block mb-1">{label}</span>
          <div className="flex items-center space-x-2">
            <Input type={inputType} value={tempValue} onChange={e => setTempValue(e.target.value)} placeholder={placeholder} className="flex-1" />
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="px-2">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSaving} className="px-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 text-gray-500 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-500 block mb-1 text-left">{label}</span>
        <div className="flex items-center justify-between">
          <p className="font-medium">{value || 'Non spécifié'}</p>
          {isOwnProfile && <Button size="sm" variant="ghost" onClick={onEdit} className="ml-2 p-1 flex-shrink-0">
              <Edit className="h-4 w-4" />
            </Button>}
        </div>
      </div>
    </div>;
};
export default ProfileEditableField;