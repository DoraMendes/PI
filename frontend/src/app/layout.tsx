import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { ClerkProvider } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AppWrappers>{children}</AppWrappers>
        </body>
      </html>
    </ClerkProvider>
  );
}
