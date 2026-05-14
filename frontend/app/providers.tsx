'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}

