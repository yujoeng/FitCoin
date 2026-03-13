// src/features/mission/missionUtils.ts

import type { MissionCandidate, Exercise } from '@/types';

/**
 * MissionCandidate(서버 데이터)와 Exercise(로컬 AI 데이터)를 합쳐
 * FitCoinExercisePage에 전달할 수 있는 Exercise 형태로 반환한다.
 *
 * @param candidate  서버에서 받은 미션 후보
 * @param exercises  로컬 AI 운동 데이터 배열 (FITCOIN_EXERCISES)
 * @param userLevel  유저 레벨 인덱스 (기본값 0 = 초급)
 * @returns 합쳐진 Exercise, 매칭 실패 시 null
 */
export function mergeWithExercise(
  candidate: MissionCandidate,
  exercises: Exercise[],
  userLevel: number = 0,
): Exercise | null {
  const exercise = exercises.find(
    (ex) => ex.name.trim() === candidate.name.trim(),
  );

  if (!exercise) return null;

  return {
    id:           exercise.id,
    missionId:    candidate.id,
    name:         candidate.name,
    description:  candidate.description,
    targetCount:  candidate.count[userLevel] ?? candidate.count[0],
    detectFn:     exercise.detectFn,
    camera:       exercise.camera,
    category:     exercise.category,
    icon:         exercise.icon,
    initialState: exercise.initialState,
    hasFeedback:  exercise.hasFeedback,
  };
}
