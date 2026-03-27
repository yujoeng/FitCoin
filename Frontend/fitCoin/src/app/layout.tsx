import React from 'react';
import type { Metadata, Viewport } from 'next';
import '@/index.css';
import AppShellProvider from '@/components/AppShellProvider';
import Prefetcher from './Prefetcher';

export const metadata: Metadata = {
  title: 'FitCoin',
  description: '운동하고 코인 모으자, FitCoin',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#96B95B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <Prefetcher />
        <div className="fc-app-shell">
          <AppShellProvider>{children}</AppShellProvider>
        </div>
      </body>
    </html>
  );
}