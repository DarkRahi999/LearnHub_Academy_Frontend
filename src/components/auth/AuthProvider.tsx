"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useAuth();

  // This component ensures auth state is initialized
  // The actual auth logic is in the useAuth hook
  useEffect(() => {
    // Auth initialization happens in useAuth hook
  }, []);

  // Show loading state while auth is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
