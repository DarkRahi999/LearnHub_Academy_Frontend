'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/interface/user';
import { 
  SystemSetting, 
  SettingCategory, 
  SettingType,
  getSettingCategoryDisplayName,
  getSettingTypeDisplayName 
} from '@/interface/system-settings';
import { 
  getAllSystemSettings, 
  groupSettingsByCategory,
  updateSystemSettingValue,
  createSystemSetting,
  deleteSystemSetting,
  initializeDefaultSystemSettings
} from '@/services/system-settings.service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Edit2, Trash2, Settings, RefreshCw } from 'lucide-react';

interface EditSettingData {
  key: string;
  value: string;
  type: SettingType;
  name: string;
  description?: string;
}

export default function SystemSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [groupedSettings, setGroupedSettings] = useState<Record<SettingCategory, SystemSetting[]>>({} as Record<SettingCategory, SystemSetting[]>);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<EditSettingData | null>(null);
  const [activeTab, setActiveTab] = useState<SettingCategory>(SettingCategory.GENERAL);

  // Create setting form data
  const [createData, setCreateData] = useState({
    key: '',
    value: '',
    type: SettingType.STRING,
    category: SettingCategory.GENERAL,
    name: '',
    description: '',
    isPublic: false,
    isEditable: true
  });

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSystemSettings();
      setGroupedSettings(groupSettingsByCategory(data));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load system settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Check if user has permission to access system settings
  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You need Super Admin privileges to access system settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEditSetting = (setting: SystemSetting) => {
    setEditingSetting({
      key: setting.key,
      value: setting.value,
      type: setting.type,
      name: setting.name,
      description: setting.description || ''
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSetting) return;

    try {
      setSaving(true);
      await updateSystemSettingValue(editingSetting.key, editingSetting.value);
      toast({
        title: "Success",
        description: "Setting updated successfully"
      });
      setEditDialogOpen(false);
      setEditingSetting(null);
      await loadSettings();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSetting = async () => {
    try {
      setSaving(true);
      await createSystemSetting(createData);
      toast({
        title: "Success",
        description: "Setting created successfully"
      });
      setCreateDialogOpen(false);
      setCreateData({
        key: '',
        value: '',
        type: SettingType.STRING,
        category: SettingCategory.GENERAL,
        name: '',
        description: '',
        isPublic: false,
        isEditable: true
      });
      await loadSettings();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create setting",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      await deleteSystemSetting(key);
      toast({
        title: "Success",
        description: "Setting deleted successfully"
      });
      await loadSettings();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete setting",
        variant: "destructive"
      });
    }
  };

  const handleInitializeDefaults = async () => {
    if (!confirm('This will create default system settings. Continue?')) return;

    try {
      setSaving(true);
      await initializeDefaultSystemSettings();
      toast({
        title: "Success",
        description: "Default settings initialized successfully"
      });
      await loadSettings();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to initialize default settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBooleanToggle = async (setting: SystemSetting, checked: boolean) => {
    try {
      setSaving(true);
      await updateSystemSettingValue(setting.key, String(checked));
      toast({
        title: "Success",
        description: "Setting updated successfully"
      });
      await loadSettings();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderSettingValue = (setting: SystemSetting) => {
    if (setting.type === SettingType.BOOLEAN) {
      return (
        <Switch
          checked={setting.value.toLowerCase() === 'true'}
          onCheckedChange={(checked: boolean) => handleBooleanToggle(setting, checked)}
          disabled={!setting.isEditable || saving}
        />
      );
    }

    if (setting.type === SettingType.JSON) {
      return (
        <div className="font-mono text-sm bg-gray-100 p-2 rounded max-w-xs overflow-x-auto">
          {setting.value}
        </div>
      );
    }

    return (
      <span className="text-sm font-medium">{setting.value}</span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading system settings...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className='mx-4'>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage application configuration and system preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleInitializeDefaults} disabled={saving}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Initialize Defaults
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Setting
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as SettingCategory)}>
        <TabsList className="grid w-full grid-cols-6">
          {Object.values(SettingCategory).map((category) => (
            <TabsTrigger key={category} value={category}>
              {getSettingCategoryDisplayName(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.values(SettingCategory).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card className='dark:bg-transparent'>
              <CardHeader>
                <CardTitle>{getSettingCategoryDisplayName(category)} Settings</CardTitle>
                <CardDescription>
                  Configure {getSettingCategoryDisplayName(category).toLowerCase()} related options
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupedSettings[category]?.length > 0 ? (
                  <div className="space-y-4">
                    {groupedSettings[category].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{setting.name}</h3>
                            <Badge variant="secondary">{getSettingTypeDisplayName(setting.type)}</Badge>
                            {setting.isPublic && <Badge variant="outline">Public</Badge>}
                            {!setting.isEditable && <Badge variant="destructive">Read Only</Badge>}
                          </div>
                          {setting.description && (
                            <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Key: {setting.key}</span>
                            <Separator orientation="vertical" className="h-4" />
                            {renderSettingValue(setting)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {setting.isEditable && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSetting(setting)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {setting.isEditable && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSetting(setting.key)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No settings found in this category
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Setting Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
          </DialogHeader>
          {editingSetting && (
            <div className="space-y-4">
              <div>
                <Label>Setting Key</Label>
                <Input value={editingSetting.key} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={editingSetting.name} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label>Value</Label>
                {editingSetting.type === SettingType.JSON ? (
                  <Textarea
                    value={editingSetting.value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                    rows={6}
                    className="font-mono"
                  />
                ) : (
                  <Input
                    value={editingSetting.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                    type={editingSetting.type === SettingType.NUMBER ? 'number' : 'text'}
                  />
                )}
              </div>
              {editingSetting.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {editingSetting.description}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Setting Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Setting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Setting Key *</Label>
                <Input
                  value={createData.key}
                  onChange={(e) => setCreateData({ ...createData, key: e.target.value })}
                  placeholder="e.g., app_theme"
                />
              </div>
              <div>
                <Label>Display Name *</Label>
                <Input
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  placeholder="e.g., Application Theme"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={createData.type} onValueChange={(value: string) => setCreateData({ ...createData, type: value as SettingType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SettingType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getSettingTypeDisplayName(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={createData.category} onValueChange={(value: string) => setCreateData({ ...createData, category: value as SettingCategory })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SettingCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {getSettingCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Value *</Label>
              {createData.type === SettingType.JSON ? (
                <Textarea
                  value={createData.value}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCreateData({ ...createData, value: e.target.value })}
                  rows={4}
                  className="font-mono"
                  placeholder='{"key": "value"}'
                />
              ) : (
                <Input
                  value={createData.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateData({ ...createData, value: e.target.value })}
                  type={createData.type === SettingType.NUMBER ? 'number' : 'text'}
                  placeholder="Enter setting value"
                />
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={createData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCreateData({ ...createData, description: e.target.value })}
                rows={2}
                placeholder="Describe what this setting controls"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={createData.isPublic}
                  onCheckedChange={(checked: boolean) => setCreateData({ ...createData, isPublic: checked })}
                />
                <Label>Public (visible to all users)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={createData.isEditable}
                  onCheckedChange={(checked: boolean) => setCreateData({ ...createData, isEditable: checked })}
                />
                <Label>Editable</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSetting} disabled={saving || !createData.key || !createData.name || !createData.value}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}