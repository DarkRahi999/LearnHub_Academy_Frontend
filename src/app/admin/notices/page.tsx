'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Edit, Trash2, Plus } from 'lucide-react';
import { noticeService, Notice, CreateNoticeDto } from '@/services/notice.service';
import { useToast } from '@/hooks/use-toast';

export default function NoticeManagement() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<CreateNoticeDto>({
    subHeading: '',
    description: '',
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await noticeService.getAllNotices();
      setNotices(data.notices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching notices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setError(null);
      await noticeService.createNotice(formData);
      setFormData({ subHeading: '', description: '' });
      setShowCreateForm(false);
      fetchNotices();
      
      // Show success toast
      toast({
        title: "Success",
        description: "Notice created successfully!",
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notice');
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to create notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    
    try {
      setFormLoading(true);
      setError(null);
      await noticeService.updateNotice(editingNotice.id, formData);
      setFormData({ subHeading: '', description: '' });
      setEditingNotice(null);
      fetchNotices();
      
      // Show success toast
      toast({
        title: "Success",
        description: "Notice updated successfully!",
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notice');
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      setFormLoading(true);
      setError(null);
      await noticeService.deleteNotice(id);
      fetchNotices();
      
      // Show success toast
      toast({
        title: "Success",
        description: "Notice deleted successfully!",
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notice');
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to delete notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const startEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      subHeading: notice.subHeading,
      description: notice.description,
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingNotice(null);
    setFormData({ subHeading: '', description: '' });
    setShowCreateForm(false);
  };

  return (
    <RoleGuard
      requiredPermissions={[Permission.CREATE_NOTICE]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6 mx-4">
          <h1 className="text-3xl font-bold">Notice Management</h1>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Notice
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingNotice) && (
          <Card className="mb-6 bg-transparent">
            <CardHeader>
              <CardTitle>
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingNotice ? handleUpdateNotice : handleCreateNotice} className="space-y-4">
                <div>
                  <label htmlFor="subHeading" className="block text-sm font-medium mb-2">
                    Sub Heading
                  </label>
                  <input
                    type="text"
                    id="subHeading"
                    value={formData.subHeading}
                    onChange={(e) => setFormData({ ...formData, subHeading: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={5}
                    maxLength={200}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                    minLength={10}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingNotice ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingNotice ? 'Update Notice' : 'Create Notice'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit} disabled={formLoading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.length === 0 ? (
              <Card className="bg-transparent">
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No notices found</h3>
                    <p>Create your first notice to get started.</p>
                    <div className="mt-6">
                      <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        Create New Notice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-lg transition-shadow bg-transparent">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{notice.subHeading}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>
                              {notice.createdBy.firstName} {notice.createdBy.lastName || ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(notice.createdAt).toLocaleDateString()}
                              {notice.editedAt && (
                                <span className="ml-1 text-xs text-muted-foreground">
                                  (edited {new Date(notice.editedAt).toLocaleDateString()})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={notice.isActive ? "default" : "secondary"}>
                          {notice.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(notice)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="flex items-center gap-1"
                          disabled={formLoading}
                        >
                          {formLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {notice.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}