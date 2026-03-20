
'use client';

import { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SPLASH_DURATION_MS = 1500;

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#FFF8E7',
      }}
    >
      <video
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
}
// 이 컴포넌트가 하는 일: GIF로 화면 전체를 덮고, 2.5초 후 onFinish 호출
