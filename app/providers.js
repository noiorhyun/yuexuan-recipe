'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
} 