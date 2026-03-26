'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  Activity, RotateCcw, CheckCircle, AlertTriangle, ArrowDown, Camera,
} from 'lucide-react';
import { STATE_LABELS, FEEDBACK_MESSAGES } from '@/AI/exercises/fitcoinUtils';
import type { Exercise } from '@/types';

// 피드백 UI 설정
const FEEDBACK_CONFIG: Record<string, { cls: string; Icon: React.ElementType; label: string }> = {
  good: { cls: 'good', Icon: CheckCircle, label: '자세 좋아요' },
  not_deep: { cls: 'warn', Icon: ArrowDown, label: '조금 더 내려가세요' },
  lean_forward: { cls: 'warn', Icon: AlertTriangle, label: '상체를 더 숙여 보세요' },
  heel_rise: { cls: 'warn', Icon: AlertTriangle, label: '발뒤꿈치가 들렸어요' },
  ready: { cls: 'neutral', Icon: Activity, label: '준비 자세' },
  no_pose: { cls: 'neutral', Icon: Camera, label: '포즈 감지 중' },
};

function FormFeedback({ feedbackKey }: { feedbackKey: string }) {
  const cfg = FEEDBACK_CONFIG[feedbackKey] ?? FEEDBACK_CONFIG.no_pose;
  const { cls, Icon, label } = cfg;
  return (
    <div className={`fc-feedback-bar ${cls}`}>
      <div className={`fc-feedback-icon ${cls}`}>
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', marginBottom: 1 }}>자세 피드백</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-1)' }}>{label}</div>
      </div>
    </div>
  );
}

interface FitCoinPoseDetectorProps {
  exercise: Exercise;
  detectFn: Exercise['detectFn'];
  onComplete: () => void;
  onFeedback?: (key: string) => void;
  onCountChange?: (count: number) => void;
}

export default function FitCoinPoseDetector({ exercise, detectFn, onComplete, onFeedback, onCountChange }: FitCoinPoseDetectorProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [angle, setAngle] = useState(0);
  const [status, setStatus] = useState<string>(exercise.initialState as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedbackKey, setFeedbackKey] = useState('no_pose');

  const statusRef = useRef<string>(exercise.initialState as string);
  const countRef = useRef(0);
  const completedRef = useRef(false);
  const throttleRef = useRef(0);

  const syncStatus: import('react').Dispatch<import('react').SetStateAction<string>> = (valOrUpdater) => {
    const val = typeof valOrUpdater === 'function' ? valOrUpdater(statusRef.current) : valOrUpdater;
    statusRef.current = val;
    setStatus(val);
  };
  const syncCount = useCallback((updater: ((prev: number) => number) | number) => {
    setCount((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      countRef.current = next;
      // [문제 1 수정] 부모 컴포넌트(FitCoinExercisePage)의 state 업데이트가 현재 렌더링 사이클과 충돌하지 않도록 지연 실행
      setTimeout(() => {
        onCountChange?.(next);
      }, 0);
      if (next >= exercise.targetCount && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => onComplete(), 600);
      }
      return next;
    });
  }, [exercise.targetCount, onComplete, onCountChange]);

  useEffect(() => {
    if (!webcamRef.current) return;

    let camera: any = null;
    let pose: any = null;

    let loadingTimeout: NodeJS.Timeout | null = null;

    const initMediapipe = async () => {
      loadingTimeout = setTimeout(() => {
        setError(true);
      }, 10000);

      // 동적 import
      const { Pose, POSE_CONNECTIONS } = await import('@mediapipe/pose');
      const cam = await import('@mediapipe/camera_utils');
      const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');

      pose = new Pose({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
      });
      pose.setOptions({
        selfieMode: true,
        modelComplexity: 0, smoothLandmarks: true, enableSegmentation: false,
        minDetectionConfidence: 0.55, minTrackingConfidence: 0.55,
      });
      pose.onResults((results: any) => {
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          loadingTimeout = null;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setLoading(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        if (results.poseLandmarks) {
          drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS,
            { color: 'rgba(255,159,115,0.7)', lineWidth: 2 });
          drawLandmarks(ctx, results.poseLandmarks,
            { color: '#E07845', fillColor: 'rgba(224,120,69,0.4)', lineWidth: 1, radius: 3.5 });

          const result = detectFn(results.poseLandmarks, statusRef.current, syncCount, syncStatus) as unknown;
          if (result && typeof result === 'object') {
            const r = result as { angle?: number; feedback?: string };
            setAngle(r.angle ?? 0);
            const now = Date.now();
            if (now - throttleRef.current > 350) {
              throttleRef.current = now;
              const key = r.feedback ?? 'good';
              setFeedbackKey(key);
              onFeedback?.(key);
            }
          } else if (typeof result === 'number') {
            setAngle(result);
          }
        } else {
          setFeedbackKey('no_pose');
        }
      });
      
      const videoEl = (webcamRef.current as unknown as { video: HTMLVideoElement }).video;
      camera = new cam.Camera(videoEl, {
        onFrame: async () => {
          const video = (webcamRef.current as unknown as { video: HTMLVideoElement })?.video;
          if (video) await pose.send({ image: video });
        },
        width: 640, height: 480,
      });
      camera.start();
    };

    initMediapipe();

    return () => { 
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (camera) camera.stop(); 
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const progress = Math.min((count / exercise.targetCount) * 100, 100);
  const statusLabel = (STATE_LABELS as Record<string, string>)[status] ?? status;

  return (
    <div>
      <Webcam ref={webcamRef} style={{ display: 'none' }} />

      {/* Canvas */}
      <div className="fc-canvas-wrap" style={{ 
        marginBottom: 10,
        width: '100%',
        aspectRatio: '4/3',
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }} 
        />
        {error ? (
          <div className="fc-canvas-overlay" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            gap: 8,
            color: '#fff'
          }}>
            <AlertTriangle size={28} color="var(--color-danger)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
              모델 로딩에 실패했습니다.<br/>페이지를 새로고침 해주세요.
            </span>
          </div>
        ) : loading ? (
          <div className="fc-canvas-overlay" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            gap: 8,
            color: '#fff'
          }}>
            <Activity size={28} color="var(--color-primary)" className="fc-pulse" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              모델 로딩 중...
            </span>
          </div>
        ) : null}
      </div>

      {/* Form Feedback */}
      {(exercise as unknown as Record<string, boolean>).hasFeedback && <FormFeedback feedbackKey={feedbackKey} />}

      {/* Stat pills */}
      <div className="fc-stat-row">
        <div className="fc-stat-pill">
          <Activity size={13} color="var(--primary)" />
          <span>상태</span>
          <b>{statusLabel}</b>
        </div>
        <div className="fc-stat-pill">
          <RotateCcw size={13} color="var(--primary)" />
          <span>각도</span>
          <b>{angle}°</b>
        </div>
      </div>

      {/* Count + Progress */}
      <div className="fc-card-soft" style={{ padding: '14px 16px' }}>
        <div className="fc-count-display">
          <span className="fc-font-point" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {count}
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            &nbsp;/ {exercise.targetCount}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(44,62,31,0.08)',
          marginTop: '10px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary)',
            transition: 'width var(--transition-normal)'
          }} />
        </div>
      </div>
    </div>
  );
}
