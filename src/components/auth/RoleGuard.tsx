'use client';

import { ReactNode } from 'react';
import { UserRole, Permission } from '@/interface/user';
import { RoleService } from '@/services/role.service';
import { getCurrentUser } from '@/services/auth.service';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  fallback?: ReactNode;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  requiredPermissions, 
  fallback = null 
}: RoleGuardProps) {
  const user = getCurrentUser();
  
  if (!user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  // Check permission-based access
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = RoleService.hasAnyPermission(user.role, requiredPermissions);
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}