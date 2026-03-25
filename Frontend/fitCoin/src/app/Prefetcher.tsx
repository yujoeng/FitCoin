'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Prefetcher() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/store');
    router.prefetch('/exchange');
    router.prefetch('/mission');
  }, [router]);

  return null;
}
