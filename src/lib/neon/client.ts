'use client';

import { createClient } from '@neondatabase/neon-js';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

// Validate required environment variables
const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
const NEON_DATA_API_URL = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;

if (!NEON_AUTH_URL) {
  throw new Error('Missing NEXT_PUBLIC_NEON_AUTH_URL environment variable');
}

if (!NEON_DATA_API_URL) {
  throw new Error('Missing NEXT_PUBLIC_NEON_DATA_API_URL environment variable');
}

/**
 * Neon Client - Auth + Data API
 *
 * @example
 * // Auth
 * const { data: session, isPending } = neonClient.auth.useSession();
 * await neonClient.auth.signUp.email({ email, password, name });
 * await neonClient.auth.signIn.email({ email, password });
 * await neonClient.auth.signOut();
 *
 * // Database queries
 * await neonClient.from('todos').select('*');
 * await neonClient.from('todos').insert({ title: 'New' }).select();
 *
 * @see https://neon.com/docs/reference/javascript-sdk
 */
export const neonClient = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: NEON_AUTH_URL,
  },
  dataApi: {
    url: NEON_DATA_API_URL,
  },
});
