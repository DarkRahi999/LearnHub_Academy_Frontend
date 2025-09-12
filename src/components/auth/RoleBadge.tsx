'use client';

import { UserRole } from '@/interface/user';
import { RoleService } from '@/services/role.service';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const displayName = RoleService.getRoleDisplayName(role);
  const colorClass = RoleService.getRoleColor(role);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {displayName}
    </span>
  );
}
