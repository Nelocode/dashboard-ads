import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  user: any;
  requiredPermission?: string;
  adminOnly?: boolean;
}

export const PermissionsGate: React.FC<Props> = ({ 
  children, 
  fallback = null, 
  user, 
  requiredPermission, 
  adminOnly = false 
}) => {
  if (!user) return <>{fallback}</>;

  // Admin always has access
  if (user.role === 'ADMIN') return <>{children}</>;

  // If specific admin-only requirement
  if (adminOnly && user.role !== 'ADMIN') return <>{fallback}</>;

  // Check granular permissions
  if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
