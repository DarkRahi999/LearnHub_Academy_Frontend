'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/interface/user';
import { 
  getAllUsers, 
  UserSearchParams 
} from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from '@/components/own/CreateUserForm';
import EditUserForm from '@/components/own/EditUserForm';
import Header from '@/components/layouts/Header';

interface UserWithActions extends UserProfile {
  selected?: boolean;
}

export default function UserManagement() {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useState<UserSearchParams>({
    search: '',
    role: undefined,
    page: 1,
    limit: 10
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithActions | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(searchParams);
      setUsers(response.users);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading users...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditForm(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create User Form */}
        <CreateUserForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchUsers();
          }}
        />
        
        {/* Edit User Form */}
        <EditUserForm
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSuccess={() => {
            setShowEditForm(false);
            fetchUsers();
          }}
          user={editingUser}
        />
      </div>
    </>
  );
}