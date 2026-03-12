// src/components/SplashScreen.tsx
// 역할: GIF를 화면 전체에 꽉 채워 보여주고, 일정 시간 후 onFinish 콜백을 호출하는 스플래시 컴포넌트

'use client';

import { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void; // 스플래시 종료 시 부모에게 알리는 콜백
}

const SPLASH_DURATION_MS = 2500;

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
        overflow: 'hidden',         // 이미지가 삐져나오지 않게 차단
        backgroundColor: '#FFF8E7', // 이미지 로딩 전 잠깐 보이는 배경색
      }}
    >
      {/* TODO: public/splash.gif 위치에 실제 GIF 파일을 넣어주세요 */}
      <img
        src="/splash.gif"
        alt="돈땃쥐미 로딩 중"
        style={{
          width: '100%',          // 가로는 화면 꽉 채움
          height: 'auto',         // 세로는 원본 비율 유지
          position: 'absolute',
          top: '50%',             // 수직 중앙 정렬
          left: 0,
          transform: 'translateY(-50%)', // 정확히 중앙으로 보정
        }}
      />
    </div>
  );
}
// 이 컴포넌트가 하는 일: GIF로 화면 전체를 덮고, 2.5초 후 onFinish 호출
