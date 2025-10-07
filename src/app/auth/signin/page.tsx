'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    // If already authenticated, redirect to callback URL
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
      return;
    }

    // If not authenticated, redirect to main auth page with callback URL
    if (status === 'unauthenticated') {
      const authUrl = `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      router.push(authUrl);
    }
  }, [session, status, router, callbackUrl]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}