'use client';

import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface AdPlayerProps {
  isOpen: boolean;
  adUrl: string;
  onEnded: () => void;
  onExitRequest: () => void;
}

const AdPlayer: React.FC<AdPlayerProps> = ({ isOpen, adUrl, onEnded, onExitRequest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isClosingRef = useRef(false);

  // 뒤로가기 상태 정리 및 닫기 처리
  const handleExit = () => {
    if (!isOpen || isClosingRef.current) return;
    isClosingRef.current = true;
    
    // 광고가 추가했던 해시 팝
    window.history.back();
    onExitRequest();
  };

  const handleEnded = () => {
    if (!isOpen || isClosingRef.current) return;
    isClosingRef.current = true;

    // 광고가 추가했던 해시 팝
    window.history.back();
    onEnded();
  };

  useEffect(() => {
    if (isOpen) {
      // 탭바 숨기기를 위해 body에 클래스 추가
      document.body.classList.add('ad-playing');
      
      // [작업 3] 뒤로가기 차단 (history.pushState + Hash 이용)
      // 해시(#)를 추가하여 확실하게 히스토리 엔트리를 생성
      window.history.pushState({ adPlaying: true }, '', '#ad-playing');

      const handlePopState = (event: PopStateEvent) => {
        if (isClosingRef.current) {
          // 의도적인 닫기(버튼 클릭/광고 종료)인 경우 차단하지 않음
          return;
        }

        // 브라우저 뒤로가기 시 해시가 사라지면 다시 추가하여 차단
        if (!window.location.hash.includes('ad-playing')) {
          window.history.pushState({ adPlaying: true }, '', '#ad-playing');
        }
      };

      window.addEventListener('popstate', handlePopState);

      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error('Auto-play failed:', err);
        });
      }

      return () => {
        document.body.classList.remove('ad-playing');
        window.removeEventListener('popstate', handlePopState);
        // 클린업 시점에 isClosing 초기화
        isClosingRef.current = false;
      };
    } else {
      document.body.classList.remove('ad-playing');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute', // fixed에서 absolute로 변경 (부모 .fc-app-shell 기준)
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200, // 탭바(100)보다 높게 설정
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={handleExit}
        className="fc-pressable"
        style={{
          position: 'absolute',
          top: 'env(safe-area-inset-top, 20px)',
          right: '20px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 210,
        }}
      >
        <X size={24} />
      </button>

      {/* 비디오 플레이어 */}
      <video
        ref={videoRef}
        src={adUrl}
        onEnded={handleEnded}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default AdPlayer;
