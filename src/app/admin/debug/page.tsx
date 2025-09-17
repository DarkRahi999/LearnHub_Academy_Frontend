'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import { Permission, UserProfile } from '@/interface/user';
import { getCurrentUser } from '@/services/auth.service';
import { RoleService } from '@/services/role.service';

export default function DebugPermissions() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userPermissions = RoleService.getUserPermissions(currentUser.role);
      setPermissions(userPermissions);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Debug Permissions</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold">User Info</h2>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            
            <div className="p-4 bg-blue-100 rounded-lg">
              <h2 className="text-xl font-semibold">User Permissions</h2>
              <ul className="list-disc pl-5 mt-2">
                {permissions.map((permission, index) => (
                  <li key={index} className="mb-1">
                    {permission}
                    {[
                      Permission.CREATE_COURSE, 
                      Permission.UPDATE_COURSE, 
                      Permission.DELETE_COURSE
                    ].includes(permission) && (
                      <span className="ml-2 text-green-600 font-bold">(Course Permission)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-100 rounded-lg">
              <h2 className="text-xl font-semibold">Course Permissions Check</h2>
              <p>
                <strong>Has CREATE_COURSE:</strong> {
                  permissions.includes(Permission.CREATE_COURSE) ? 'Yes' : 'No'
                }
              </p>
              <p>
                <strong>Has UPDATE_COURSE:</strong> {
                  permissions.includes(Permission.UPDATE_COURSE) ? 'Yes' : 'No'
                }
              </p>
              <p>
                <strong>Has DELETE_COURSE:</strong> {
                  permissions.includes(Permission.DELETE_COURSE) ? 'Yes' : 'No'
                }
              </p>
              <p className="mt-2">
                <strong>Can Access Course Management:</strong> {
                  permissions.includes(Permission.CREATE_COURSE) && 
                  permissions.includes(Permission.UPDATE_COURSE) && 
                  permissions.includes(Permission.DELETE_COURSE) 
                    ? 'Yes' 
                    : 'No'
                }
              </p>
            </div>
          </div>
        ) : (
          <p>Please log in to see permissions information.</p>
        )}
      </div>
    </>
  );
}