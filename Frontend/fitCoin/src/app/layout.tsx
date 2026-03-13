import React from 'react';
import type { Metadata } from 'next';
import { AppTabBar } from '@/components/AppShell';
import '@/index.css';


export const metadata: Metadata = {
  title: 'FitCoin',
  description: '운동하고 코인 모으자, FitCoin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <div className="fc-app-shell">
          <main style={{ paddingBottom: '80px' }}>
            {children}
          </main>
          <AppTabBar />
        </div>
      </body>
    </html>
  );
}
