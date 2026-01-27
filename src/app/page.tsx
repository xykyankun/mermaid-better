'use client';

import { neonClient } from '@/lib/neon/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, isPending } = neonClient.auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    } else if (session) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return null;
}