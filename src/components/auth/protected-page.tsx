
'use client';

import { useRequireAuth } from '@/hooks/use-require-auth';
import { ReactNode } from 'react';

export default function ProtectedPage({ children }: { children: ReactNode }) {
  const { user, isLoading } = useRequireAuth();

  // While checking for user auth, show a loading screen
  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected page content
  return <>{children}</>;
}
