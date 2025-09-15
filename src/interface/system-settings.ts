//W---------={ System Settings Interface }=----------
export enum SettingType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

export enum SettingCategory {
  GENERAL = 'general',
  EMAIL = 'email',
  NOTIFICATION = 'notification',
  SECURITY = 'security',
  MAINTENANCE = 'maintenance',
  APPEARANCE = 'appearance',
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  type: SettingType;
  category: SettingCategory;
  name: string;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSystemSettingData {
  key: string;
  value: string;
  type: SettingType;
  category: SettingCategory;
  name: string;
  description?: string;
  isPublic?: boolean;
  isEditable?: boolean;
}

export interface UpdateSystemSettingData {
  value?: string;
  type?: SettingType;
  category?: SettingCategory;
  name?: string;
  description?: string;
  isPublic?: boolean;
  isEditable?: boolean;
}

export interface SystemSettingValue {
  key: string;
  value: unknown;
}

export interface SettingsByCategory {
  [SettingCategory.GENERAL]: SystemSetting[];
  [SettingCategory.EMAIL]: SystemSetting[];
  [SettingCategory.NOTIFICATION]: SystemSetting[];
  [SettingCategory.SECURITY]: SystemSetting[];
  [SettingCategory.MAINTENANCE]: SystemSetting[];
  [SettingCategory.APPEARANCE]: SystemSetting[];
}

//W---------={ Utility Functions }=----------
export const getSettingCategoryDisplayName = (category: SettingCategory): string => {
  const categoryNames = {
    [SettingCategory.GENERAL]: 'General',
    [SettingCategory.EMAIL]: 'Email',
    [SettingCategory.NOTIFICATION]: 'Notifications',
    [SettingCategory.SECURITY]: 'Security',
    [SettingCategory.MAINTENANCE]: 'Maintenance',
    [SettingCategory.APPEARANCE]: 'Appearance',
  };
  return categoryNames[category] || category;
};

export const getSettingTypeDisplayName = (type: SettingType): string => {
  const typeNames = {
    [SettingType.STRING]: 'Text',
    [SettingType.NUMBER]: 'Number',
    [SettingType.BOOLEAN]: 'Yes/No',
    [SettingType.JSON]: 'JSON',
  };
  return typeNames[type] || type;
};

export const parseSettingValue = (value: string, type: SettingType): unknown => {
  switch (type) {
    case SettingType.NUMBER:
      return Number(value);
    case SettingType.BOOLEAN:
      return value.toLowerCase() === 'true';
    case SettingType.JSON:
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
};

export const formatSettingValue = (value: unknown, type: SettingType): string => {
  switch (type) {
    case SettingType.JSON:
      return JSON.stringify(value, null, 2);
    default:
      return String(value);
  }
};

export const validateSettingValue = (value: string, type: string): boolean => {
  switch (type) {
    case 'number':
      return !isNaN(Number(value));
    case 'boolean':
      return ['true', 'false'].includes(value.toLowerCase());
    case 'json':
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    default:
      return true; // STRING type is always valid
  }
};
