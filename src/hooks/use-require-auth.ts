
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';

export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the loading state is resolved before checking for a user
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  return { user, isLoading };
}
