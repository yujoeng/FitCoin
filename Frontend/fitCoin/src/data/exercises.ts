// ── exercises.ts: 운동 데이터 ──
import type { Exercise } from '@/types';

// AI 폴더의 운동 감지 함수들 (allowJs: true이므로 .js import 가능)
import { detectSquat,          FITCOIN_EXERCISE_SQUAT          } from '@/AI/exercises/Squat';
import { detectLunge,          FITCOIN_EXERCISE_LUNGE          } from '@/AI/exercises/Lunge';
import { detectPlank,          FITCOIN_EXERCISE_PLANK          } from '@/AI/exercises/Plank';
import { detectCalfRaise,      FITCOIN_EXERCISE_CALF_RAISE     } from '@/AI/exercises/CalfRaise';
import { detectKneeRaise,      FITCOIN_EXERCISE_KNEE_RAISE     } from '@/AI/exercises/KneeRaise';
import { detectHipHinge,       FITCOIN_EXERCISE_HIP_HINGE      } from '@/AI/exercises/HipHinge';
import { detectShoulderRaise,  FITCOIN_EXERCISE_SHOULDER_RAISE } from '@/AI/exercises/ShoulderRaise';
import { detectBicepCurl,      FITCOIN_EXERCISE_BICEP_CURL     } from '@/AI/exercises/BicepCurl';
import { detectOverheadPress,  FITCOIN_EXERCISE_OVERHEAD_PRESS } from '@/AI/exercises/OverheadPress';
import { detectShoulderShrug,  FITCOIN_EXERCISE_SHOULDER_SHRUG } from '@/AI/exercises/ShoulderShrug';
import { detectNeckSideStretch, FITCOIN_EXERCISE_NECK_SIDE_STRETCH  } from '@/AI/exercises/NeckSideStretch';
import { detectNeckFrontStretch, FITCOIN_EXERCISE_NECK_FRONT_STRETCH } from '@/AI/exercises/NeckFrontStretch';
import { detectSideStretch,    FITCOIN_EXERCISE_SIDE_STRETCH   } from '@/AI/exercises/SideStretch';
import { detectChestOpen,      FITCOIN_EXERCISE_CHEST_OPEN     } from '@/AI/exercises/ChestOpen';
import { detectWristStretch,   FITCOIN_EXERCISE_WRIST_STRETCH  } from '@/AI/exercises/WristStretch';

function toExercise(meta: any, detectFn: Exercise['detectFn']): Exercise {
  return {
    ...meta,
    camera: meta.camera as 'full' | 'upper',
    detectFn,
  };
}

export const FITCOIN_EXERCISES: Exercise[] = [
  toExercise(FITCOIN_EXERCISE_SQUAT,          detectSquat         ),
  toExercise(FITCOIN_EXERCISE_LUNGE,          detectLunge         ),
  toExercise(FITCOIN_EXERCISE_PLANK,          detectPlank         ),
  toExercise(FITCOIN_EXERCISE_CALF_RAISE,     detectCalfRaise     ),
  toExercise(FITCOIN_EXERCISE_KNEE_RAISE,     detectKneeRaise     ),
  toExercise(FITCOIN_EXERCISE_HIP_HINGE,      detectHipHinge      ),
  toExercise(FITCOIN_EXERCISE_SHOULDER_RAISE, detectShoulderRaise ),
  toExercise(FITCOIN_EXERCISE_BICEP_CURL,     detectBicepCurl     ),
  toExercise(FITCOIN_EXERCISE_OVERHEAD_PRESS, detectOverheadPress ),
  toExercise(FITCOIN_EXERCISE_SHOULDER_SHRUG, detectShoulderShrug ),
  toExercise(FITCOIN_EXERCISE_NECK_SIDE_STRETCH,  detectNeckSideStretch  ),
  toExercise(FITCOIN_EXERCISE_NECK_FRONT_STRETCH, detectNeckFrontStretch ),
  toExercise(FITCOIN_EXERCISE_SIDE_STRETCH,   detectSideStretch   ),
  toExercise(FITCOIN_EXERCISE_CHEST_OPEN,     detectChestOpen     ),
  toExercise(FITCOIN_EXERCISE_WRIST_STRETCH,  detectWristStretch  ),
];

export const FITCOIN_POINT_POLICY = { first: 1000, bonus: 500 } as const;
