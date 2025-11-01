'use client';

import { useState, useEffect, useCallback } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserProfile, UserRole } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { adminService, AdminSearchParams } from '@/services/admin.service';
import { getAllUsers } from '@/services/user.service';
import { Search, Users, UserPlus, UserMinus, Shield, Crown, AlertTriangle, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Permission } from '@/interface/permission';

interface AdminWithActions extends UserProfile {
  canDemote: boolean;
}

interface RegularUser extends UserProfile {
  canPromote: boolean;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminWithActions[]>([]);
  const [regularUsers, setRegularUsers] = useState<RegularUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<AdminSearchParams>({
    search: '',
    page: 1,
    limit: 10
  });

  // Dialog states
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showDemoteDialog, setShowDemoteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({ totalAdmins: 0, activeAdmins: 0 });
  const { toast } = useToast();
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAdmins(searchParams);
      const adminsWithActions = response.admins.map(admin => ({
        ...admin,
        canDemote: admin.role === UserRole.ADMIN // Can't demote Super Admin
      }));
      setAdmins(adminsWithActions);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, toast]);

  const fetchRegularUsers = useCallback(async () => {
    try {
      const response = await getAllUsers({ search: '', role: UserRole.USER, page: 1, limit: 100 });
      const usersWithActions = response.users.map(user => ({
        ...user,
        canPromote: user.role === UserRole.USER
      }));
      setRegularUsers(usersWithActions);
    } catch (error) {
      console.error('Failed to fetch regular users:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await adminService.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
    fetchRegularUsers();
    fetchStats();
  }, [fetchAdmins, fetchRegularUsers, fetchStats]);

  const handlePromoteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminService.promoteToAdmin(selectedUser.id.toString());

      toast({
        title: "Success",
        description: `${selectedUser.firstName} has been promoted to admin`
      });

      setShowPromoteDialog(false);
      setSelectedUser(null);
      fetchAdmins();
      fetchRegularUsers();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to promote user",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDemoteAdmin = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminService.demoteAdmin(selectedUser.id.toString());

      toast({
        title: "Success",
        description: `${selectedUser.firstName} has been demoted to user`
      });

      setShowDemoteDialog(false);
      setSelectedUser(null);
      fetchAdmins();
      fetchRegularUsers();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to demote admin",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openPromoteDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setShowPromoteDialog(true);
  };

  const openDemoteDialog = (admin: UserProfile) => {
    setSelectedUser(admin);
    setShowDemoteDialog(true);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="w-4 h-4" />;
      case UserRole.ADMIN:
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "default" as const;
      case UserRole.ADMIN:
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <RoleGuard
      requiredPermissions={[Permission.MANAGE_ADMINS]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div className=''>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Admin Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage administrator roles and permissions
            </p>
          </div>
        </div>

        {/* Super Admin Notice */}
        <div className="mb-6 p-4 bg-blue-50 border dark:bg-transparent border-blue-200 rounded-lg flex items-start gap-3">
          <Star className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Super Admin Feature</h3>
            <p className="text-blue-700 text-sm">
              Only Super Admins can promote users to Admin roles and demote Admins to regular users.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className='dark:bg-transparent'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            </CardContent>
          </Card>
          <Card className='dark:bg-transparent'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAdmins}</div>
            </CardContent>
          </Card>
          <Card className='dark:bg-transparent'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Users</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{regularUsers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search admins..."
              value={searchParams.search}
              onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Admins */}
          <Card className='dark:bg-transparent'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Current Admins ({admins.length})
              </CardTitle>
              <CardDescription>
                Users with administrative privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading admins...</div>
              ) : admins.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No admins found</div>
              ) : (
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {getRoleIcon(admin.role)}
                        </div>
                        <div>
                          <div className="font-medium">{admin.firstName} {admin.lastName}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getRoleBadgeVariant(admin.role)}>
                              {admin.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Admin'}
                            </Badge>
                            {admin.isBlocked && (
                              <Badge variant="destructive">Blocked</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {admin.canDemote && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDemoteDialog(admin)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <UserMinus className="w-4 h-4 mr-1" />
                            Demote
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Regular Users */}
          <Card className='dark:bg-transparent'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Regular Users ({regularUsers.length})
              </CardTitle>
              <CardDescription>
                Users eligible for promotion to admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {regularUsers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No users available for promotion</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {regularUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getRoleBadgeVariant(user.role)}>User</Badge>
                            {user.isBlocked && (
                              <Badge variant="destructive">Blocked</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user.canPromote && !user.isBlocked && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPromoteDialog(user)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Promote
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Promote Dialog */}
        <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Promote to Admin
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to promote <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> to administrator?
                <br /><br />
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  This will grant them administrative privileges.
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPromoteDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePromoteUser}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? 'Promoting...' : 'Promote to Admin'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Demote Dialog */}
        <Dialog open={showDemoteDialog} onOpenChange={setShowDemoteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserMinus className="h-5 w-5" />
                Demote Admin
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to demote <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> from administrator to regular user?
                <br /><br />
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  This will remove their administrative privileges.
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDemoteDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDemoteAdmin}
                disabled={actionLoading}
                variant="destructive"
              >
                {actionLoading ? 'Demoting...' : 'Demote to User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}