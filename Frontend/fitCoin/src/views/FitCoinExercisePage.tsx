'use client';

import React, { useRef, useCallback, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import FitCoinPoseDetector from '@/components/FitCoinPoseDetector';
import type { Exercise } from '@/types';

interface FitCoinExercisePageProps {
  mission: Exercise;
  onComplete: (feedbacks: string[]) => void;
  onBack: () => void;
  // TODO: 포인트/코인 실제 값은 부모(FitCoinApp.tsx or page.tsx)에서 props로 받아야 함
  point?: number;
  coin?: number;
}

export default function FitCoinExercisePage({
  mission,
  onComplete,
  onBack,
  point = 0,
  coin = 0,
}: FitCoinExercisePageProps) {
  const feedbacksRef = useRef<string[]>([]);
  // 카운트를 여기서 관리 — PoseDetector에서 올려받음
  const [count, setCount] = useState(0);

  const handleFeedback = useCallback((key: string) => {
    if (key && key !== 'no_pose' && key !== 'ready') {
      feedbacksRef.current.push(key);
    }
  }, []);

  const handleComplete = useCallback(() => {
    onComplete(feedbacksRef.current);
  }, [onComplete]);

  const handleCountChange = useCallback((next: number) => {
    setCount(next);
  }, []);

  return (
    // fc-anim-fade: index.css에 있는 페이드인 애니메이션 클래스
    <div className="fc-anim-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--bg)' }}>

      {/* ── 상단 헤더 ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--card-border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {/* 왼쪽: 뒤로가기 + 운동 이름 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-1)',
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)' }}>
            {mission.name}
          </span>
        </div>

        {/* 오른쪽: 포인트 + 코인 표시 */}
        {/* TODO: point, coin은 부모에서 실제 값으로 교체 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '1rem' }}>🐾</span>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-2)' }}>{point}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '1rem' }}>💗</span>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-2)' }}>{coin}</span>
          </div>
        </div>
      </div>

      {/* ── 본문 영역 ── */}
      <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 카메라 안내 배너 (와이어프레임의 보라색 박스) */}
        <div style={{
          background: 'rgba(150, 100, 220, 0.1)',
          border: '1px solid rgba(150, 100, 220, 0.25)',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: '#7B5EA7',
        }}>
          {mission.camera === 'full'
            ? '전신이 카메라에 보이도록 설치해 주세요'
            : '상체(허리 위)만 보여도 됩니다'}
        </div>

        {/* PoseDetector — 카메라 + 피드백 + 상태/각도 뱃지 */}
        {/* 카운트/프로그레스는 PoseDetector에서 제거했고, 아래에서 따로 크게 보여줌 */}
        <FitCoinPoseDetector
          key={mission.id}
          exercise={mission}
          detectFn={mission.detectFn}
          onComplete={handleComplete}
          onFeedback={handleFeedback}
          onCountChange={handleCountChange}
        />

        {/* ── 큰 카운트 숫자 (와이어프레임 기준) ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: 4,
          padding: '8px 0 4px',
        }}>
          {/* 큰 숫자 */}
          <span style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#C17A4A',   // 와이어프레임의 갈색 계열
            lineHeight: 1,
          }}>
            {count}
          </span>
          {/* / 목표 횟수 */}
          <span style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--text-3)',
          }}>
            / {mission.targetCount}
          </span>
        </div>

      </div>
    </div>
  );
}