// ── exercises.ts: 운동 데이터 (시연용 5개) ──
import type { Exercise } from '@/types';

import { detectSquat,         FITCOIN_EXERCISE_SQUAT         } from '@/AI/exercises/Squat';
import { detectLunge,         FITCOIN_EXERCISE_LUNGE         } from '@/AI/exercises/Lunge';
import { detectPlank,         FITCOIN_EXERCISE_PLANK         } from '@/AI/exercises/Plank';
import { detectBicepCurl,     FITCOIN_EXERCISE_BICEP_CURL    } from '@/AI/exercises/BicepCurl';
import { detectOverheadPress, FITCOIN_EXERCISE_OVERHEAD_PRESS } from '@/AI/exercises/OverheadPress';

function toExercise(meta: any, detectFn: Exercise['detectFn']): Exercise {
  return {
    ...meta,
    camera: meta.camera as 'full' | 'upper',
    detectFn,
  };
}

export const FITCOIN_EXERCISES: Exercise[] = [
  toExercise(FITCOIN_EXERCISE_OVERHEAD_PRESS, detectOverheadPress),
  toExercise(FITCOIN_EXERCISE_SQUAT,          detectSquat        ),
  toExercise(FITCOIN_EXERCISE_LUNGE,          detectLunge        ),
  toExercise(FITCOIN_EXERCISE_PLANK,          detectPlank        ),
  toExercise(FITCOIN_EXERCISE_BICEP_CURL,     detectBicepCurl    ),
];

export const FITCOIN_POINT_POLICY = { first: 1000, bonus: 500 } as const;

