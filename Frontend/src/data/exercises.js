// ── exercises 데이터 (모든 운동 import + FITCOIN_EXERCISES 배열) ──

import { detectSquat,         FITCOIN_EXERCISE_SQUAT         } from '../../../AI/exercises/Squat';
import { detectLunge,         FITCOIN_EXERCISE_LUNGE         } from '../../../AI/exercises/Lunge';
import { detectPlank,         FITCOIN_EXERCISE_PLANK         } from '../../../AI/exercises/Plank';
import { detectCalfRaise,     FITCOIN_EXERCISE_CALF_RAISE    } from '../../../AI/exercises/CalfRaise';
import { detectKneeRaise,     FITCOIN_EXERCISE_KNEE_RAISE    } from '../../../AI/exercises/KneeRaise';
import { detectHipHinge,      FITCOIN_EXERCISE_HIP_HINGE     } from '../../../AI/exercises/HipHinge';
import { detectShoulderRaise, FITCOIN_EXERCISE_SHOULDER_RAISE} from '../../../AI/exercises/ShoulderRaise';
import { detectBicepCurl,     FITCOIN_EXERCISE_BICEP_CURL    } from '../../../AI/exercises/BicepCurl';
import { detectOverheadPress, FITCOIN_EXERCISE_OVERHEAD_PRESS} from '../../../AI/exercises/OverheadPress';
import { detectShoulderShrug, FITCOIN_EXERCISE_SHOULDER_SHRUG} from '../../../AI/exercises/ShoulderShrug';
import { detectNeckSideStretch,  FITCOIN_EXERCISE_NECK_SIDE  } from '../../../AI/exercises/NeckSideStretch';
import { detectNeckFrontStretch, FITCOIN_EXERCISE_NECK_FRONT } from '../../../AI/exercises/NeckFrontStretch';
import { detectSideStretch,   FITCOIN_EXERCISE_SIDE_STRETCH  } from '../../../AI/exercises/SideStretch';
import { detectChestOpen,     FITCOIN_EXERCISE_CHEST_OPEN    } from '../../../AI/exercises/ChestOpen';
import { detectWristStretch,  FITCOIN_EXERCISE_WRIST_STRETCH } from '../../../AI/exercises/WristStretch';

export const FITCOIN_EXERCISES = [
  { ...FITCOIN_EXERCISE_SQUAT,         detectFn: detectSquat         },
  { ...FITCOIN_EXERCISE_LUNGE,         detectFn: detectLunge         },
  { ...FITCOIN_EXERCISE_PLANK,         detectFn: detectPlank         },
  { ...FITCOIN_EXERCISE_CALF_RAISE,    detectFn: detectCalfRaise     },
  { ...FITCOIN_EXERCISE_KNEE_RAISE,    detectFn: detectKneeRaise     },
  { ...FITCOIN_EXERCISE_HIP_HINGE,     detectFn: detectHipHinge      },
  { ...FITCOIN_EXERCISE_SHOULDER_RAISE,detectFn: detectShoulderRaise },
  { ...FITCOIN_EXERCISE_BICEP_CURL,    detectFn: detectBicepCurl     },
  { ...FITCOIN_EXERCISE_OVERHEAD_PRESS,detectFn: detectOverheadPress },
  { ...FITCOIN_EXERCISE_SHOULDER_SHRUG,detectFn: detectShoulderShrug },
  { ...FITCOIN_EXERCISE_NECK_SIDE,     detectFn: detectNeckSideStretch },
  { ...FITCOIN_EXERCISE_NECK_FRONT,    detectFn: detectNeckFrontStretch},
  { ...FITCOIN_EXERCISE_SIDE_STRETCH,  detectFn: detectSideStretch   },
  { ...FITCOIN_EXERCISE_CHEST_OPEN,    detectFn: detectChestOpen     },
  { ...FITCOIN_EXERCISE_WRIST_STRETCH, detectFn: detectWristStretch  },
];

export const FITCOIN_POINT_POLICY = { first: 1000, bonus: 500 };
