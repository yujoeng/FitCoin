'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import {
  Activity, RotateCcw, CheckCircle, AlertTriangle, ArrowDown, Camera,
} from 'lucide-react';
import { STATE_LABELS, FEEDBACK_MESSAGES } from '@/AI/exercises/fitcoinUtils';
import type { Exercise } from '@/types';

// 피드백 UI 설정
const FEEDBACK_CONFIG: Record<string, { cls: string; Icon: React.ElementType; label: string }> = {
  good:         { cls: 'good',    Icon: CheckCircle,   label: '자세 좋아요' },
  not_deep:     { cls: 'warn',    Icon: ArrowDown,     label: '조금 더 내려가세요' },
  lean_forward: { cls: 'warn',   Icon: AlertTriangle,  label: '상체를 더 숙여 보세요' },
  heel_rise:    { cls: 'warn',   Icon: AlertTriangle,  label: '발뒤꿈치가 들렸어요' },
  ready:        { cls: 'neutral', Icon: Activity,      label: '준비 자세' },
  no_pose:      { cls: 'neutral', Icon: Camera,        label: '포즈 감지 중' },
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
}

export default function FitCoinPoseDetector({ exercise, detectFn, onComplete, onFeedback }: FitCoinPoseDetectorProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [angle, setAngle] = useState(0);
  const [status, setStatus] = useState<string>(exercise.initialState as string);
  const [loading, setLoading] = useState(true);
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
      if (next >= exercise.targetCount && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => onComplete(), 600);
      }
      return next;
    });
  }, [exercise.targetCount, onComplete]);

  useEffect(() => {
    if (!webcamRef.current) return;
    const pose = new Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1, smoothLandmarks: true, enableSegmentation: false,
      minDetectionConfidence: 0.55, minTrackingConfidence: 0.55,
    });
    pose.onResults((results) => {
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
    const camera = new cam.Camera(videoEl, {
      onFrame: async () => {
        const video = (webcamRef.current as unknown as { video: HTMLVideoElement })?.video;
        if (video) await pose.send({ image: video });
      },
      width: 640, height: 480,
    });
    camera.start();
    return () => { camera.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const progress = Math.min((count / exercise.targetCount) * 100, 100);
  const statusLabel = (STATE_LABELS as Record<string, string>)[status] ?? status;

  return (
    <div>
      <Webcam ref={webcamRef} style={{ display: 'none' }} />

      {/* Canvas */}
      <div className="fc-canvas-wrap" style={{ marginBottom: 10 }}>
        <canvas ref={canvasRef} width={640} height={480} />
        {loading && (
          <div className="fc-canvas-overlay">
            <Activity size={28} color="var(--primary)" className="fc-pulse" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-3)' }}>
              모델 로딩 중...
            </span>
          </div>
        )}
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
          <span className="fc-count-num">{count}</span>
          <span className="fc-count-denom"> / {exercise.targetCount}</span>
        </div>
        <div className="fc-progress-track" style={{ marginTop: 10 }}>
          <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
