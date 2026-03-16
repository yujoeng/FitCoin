'use client';

import React, { useState, useEffect } from 'react';
import { AppTopBar, AppTabBar } from '@/components/AppShell';
import FitCoinCoachPage from '@/views/FitCoinCoachPage';

type PageType = 'coach';

export default function FitCoinApp() {
  const [page, setPage] = useState<PageType>('coach');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const tabLabel = ({ mission: 'mission', coach: 'coach' } as const)[page] ?? 'mission';

  return (
    <div className="fc-app-shell">
      <AppTopBar
        page={page}
        mission={null}
        streak={{ count: 0, lastDate: '' }}
        totalPoints={0}
        onBack={() => {}}
      />

      <div className="fc-body">
        {page === 'coach' && <FitCoinCoachPage />}
      </div>

      <AppTabBar active={tabLabel} />
    </div>
  );
}
