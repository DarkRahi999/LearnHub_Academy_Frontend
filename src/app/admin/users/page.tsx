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
  UserPlus,
  MoreVertical,
  Edit,
  Shield,
  ShieldOff,
  Trash2,
  UserX,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from '@/components/own/CreateUserForm';
import EditUserForm from '@/components/own/EditUserForm';
import Header from '@/components/layouts/Header';
import { 
  updateUserRole, 
  updateUserStatus, 
  deleteUser 
} from '@/services/user.service';
import { UserRole } from '@/interface/user';
import { useAuth } from '@/hooks/useAuth';
import { RoleService } from '@/services/role.service';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserWithActions | null>(null);
  
  const { user: currentUser } = useAuth();

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

  const handleRoleChange = async (user: UserWithActions, newRole: UserRole) => {
    try {
      await updateUserRole(user.id, newRole);
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
      fetchUsers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (user: UserWithActions) => {
    try {
      await updateUserStatus(user.id, !user.isBlocked);
      toast({
        title: "Success",
        description: `User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`,
      });
      fetchUsers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    try {
      await deleteUser(deletingUser.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setShowDeleteDialog(false);
      setDeletingUser(null);
      fetchUsers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const canManageUser = (targetUser: UserWithActions) => {
    if (!currentUser) return false;
    return RoleService.canManageUser(currentUser.role, targetUser.role);
  };

  const canDeleteUser = (targetUser: UserWithActions) => {
    if (!currentUser) return false;
    return currentUser.role === UserRole.SUPER_ADMIN && targetUser.role !== UserRole.SUPER_ADMIN;
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className='mx-4'>
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                        {user.isBlocked && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Blocked
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === UserRole.SUPER_ADMIN ? 'bg-red-100 text-red-800' :
                          user.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role === UserRole.SUPER_ADMIN ? 'Super Admin' :
                           user.role === UserRole.ADMIN ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setShowEditForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      {canManageUser(user) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* Role Management */}
                            {user.role === UserRole.USER && (
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user, UserRole.ADMIN)}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Promote to Admin
                              </DropdownMenuItem>
                            )}
                            
                            {user.role === UserRole.ADMIN && currentUser?.role === UserRole.SUPER_ADMIN && (
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user, UserRole.USER)}
                              >
                                <ShieldOff className="h-4 w-4 mr-2" />
                                Demote to User
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {/* Block/Unblock */}
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user)}
                            >
                              {user.isBlocked ? (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unblock User
                                </>
                              ) : (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Block User
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            {/* Delete */}
                            {canDeleteUser(user) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setDeletingUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
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
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{deletingUser?.firstName} {deletingUser?.lastName}&quot;? 
                This action cannot be undone and will permanently remove the user and all their data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeletingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}