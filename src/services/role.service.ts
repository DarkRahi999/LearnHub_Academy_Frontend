import { Permission } from '@/interface/permission';
import { UserRole } from '@/interface/user';

export class RoleService {
  private static rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.USER]: [
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.VIEW_NOTICES,
    ],
    [UserRole.ADMIN]: [
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.VIEW_NOTICES,
      Permission.CREATE_NOTICE,
      Permission.UPDATE_NOTICE,
      Permission.DELETE_NOTICE,
      Permission.MANAGE_USERS,
      Permission.CREATE_COURSE,
      Permission.UPDATE_COURSE,
      Permission.DELETE_COURSE,
      Permission.CREATE_BOOK,
      Permission.UPDATE_BOOK,
      Permission.DELETE_BOOK,
      Permission.CREATE_QUESTION,
      Permission.UPDATE_QUESTION,
      Permission.DELETE_QUESTION,
      Permission.CREATE_EXAM,
      Permission.UPDATE_EXAM,
      Permission.DELETE_EXAM,
    ],
    [UserRole.SUPER_ADMIN]: [
      Permission.VIEW_PROFILE,
      Permission.UPDATE_PROFILE,
      Permission.VIEW_NOTICES,
      Permission.CREATE_NOTICE,
      Permission.UPDATE_NOTICE,
      Permission.DELETE_NOTICE,
      Permission.MANAGE_USERS,
      Permission.MANAGE_ADMINS,
      Permission.MANAGE_PERMISSIONS,
      Permission.SYSTEM_SETTINGS,
      Permission.CREATE_COURSE,
      Permission.UPDATE_COURSE,
      Permission.DELETE_COURSE,
      Permission.CREATE_BOOK,
      Permission.UPDATE_BOOK,
      Permission.DELETE_BOOK,
      Permission.CREATE_QUESTION,
      Permission.UPDATE_QUESTION,
      Permission.DELETE_QUESTION,
      Permission.CREATE_EXAM,
      Permission.UPDATE_EXAM,
      Permission.DELETE_EXAM,
    ],
  };

  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    const permissions = this.rolePermissions[userRole] || [];
    return permissions.includes(permission);
  }

  static hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  static hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  static getUserPermissions(userRole: UserRole): Permission[] {
    return this.rolePermissions[userRole] || [];
  }

  static canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
    // Super admin can manage everyone
    if (managerRole === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Admin can manage users but not other admins or super admins
    if (managerRole === UserRole.ADMIN) {
      return targetRole === UserRole.USER;
    }

    // Users cannot manage anyone
    return false;
  }

  static canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
    // Super admin can assign any role
    if (assignerRole === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Admin can only assign user role
    if (assignerRole === UserRole.ADMIN) {
      return targetRole === UserRole.USER;
    }

    // Users cannot assign any role
    return false;
  }

  static getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.USER:
        return 'User';
      default:
        return 'Unknown';
    }
  }

  static getRoleColor(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'text-red-600 bg-red-100';
      case UserRole.ADMIN:
        return 'text-blue-600 bg-blue-100';
      case UserRole.USER:
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}