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

  useEffect(() => {
    if (isOpen) {
      // 탭바 숨기기를 위해 body에 클래스 추가
      document.body.classList.add('ad-playing');
      
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error('Auto-play failed:', err);
        });
      }
    } else {
      document.body.classList.remove('ad-playing');
    }

    return () => {
      document.body.classList.remove('ad-playing');
    };
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
        onClick={onExitRequest}
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
        onEnded={onEnded}
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
