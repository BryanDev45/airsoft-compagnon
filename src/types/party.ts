
export interface LocationSectionProps {
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
}

export interface ProtectionSectionProps {
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
}

export interface ConsumablesSectionProps {
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
}

export interface PowerLimitsSectionProps {
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
}

export interface SettingsSectionProps {
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
}

export interface GeneralInfoSectionProps {
  gameTypes: {
    value: string;
    label: string;
  }[];
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
}

export interface ImageUploadSectionProps {
  updateFormData?: (section: string, data: any) => void;
  initialData?: any;
  images: File[];
  preview: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}
