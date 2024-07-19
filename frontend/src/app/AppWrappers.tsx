'use client';

import React, { ReactNode } from 'react';
import 'styles/App.css';
import 'styles/Contact.css';
import 'styles/MiniCalendar.css';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import theme from '../theme/theme';
import { useClerk, useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AppWrappers({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const clerk = useClerk();
  const path = usePathname();

  const router = useRouter();
  
  React.useEffect(() => {
    if (!clerk.loaded) return;

    if (!auth.isSignedIn) clerk.redirectToSignIn();
    else if (path.includes("/sign-in")) router.push('/admin/default');
  }, [clerk.loaded]);
  
  return (
    <CacheProvider>
        <ChakraProvider theme={theme}>{clerk.loaded ? children : <div style={{ 
          height: '100vh', width: "100vw", display: "grid", placeItems: "center"
        }}><Spinner></Spinner></div>}</ChakraProvider>{' '}
    </CacheProvider>
  );
}
