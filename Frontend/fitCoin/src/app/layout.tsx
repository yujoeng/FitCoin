import React from 'react';
import type { Metadata } from 'next';
import '@/index.css';
import AppShellProvider from '@/components/AppShellProvider';

export const metadata: Metadata = {
  title: 'FitCoin',
  description: '운동하고 코인 모으자, FitCoin',
  icons: {
    icon: '/icons/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <div className="fc-app-shell">
          <AppShellProvider>{children}</AppShellProvider>
        </div>
      </body>
    </html>
  );
}