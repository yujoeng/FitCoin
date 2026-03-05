import React, { useRef, useCallback } from 'react';
import { Camera } from 'lucide-react';
import FitCoinPoseDetector from '../components/FitCoinPoseDetector';

export default function FitCoinExercisePage({ mission, onComplete, onBack }) {
  // 운동 중 피드백 키를 모아서 완료 시 전달
  const feedbacksRef = useRef([]);

  const handleFeedback = useCallback((key) => {
    if (key && key !== 'no_pose' && key !== 'ready') {
      feedbacksRef.current.push(key);
    }
  }, []);

  const handleComplete = useCallback(() => {
    onComplete(feedbacksRef.current);
  }, [onComplete]);

  return (
    <div className="fc-anim-fade">
      <div className="fc-camera-hint" style={{ marginBottom: 12 }}>
        <Camera size={14} />
        <span>
          {mission.camera === 'full'
            ? '전신이 카메라에 보이도록 설치해 주세요'
            : '상체(허리 위)만 보여도 됩니다'}
        </span>
      </div>

      <FitCoinPoseDetector
        key={mission.id}
        exercise={mission}
        detectFn={mission.detectFn}
        onComplete={handleComplete}
        onFeedback={handleFeedback}
      />
    </div>
  );
}

