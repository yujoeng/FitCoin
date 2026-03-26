import apiClient from './apiClient';
import type {
  ApiResponse,
  MissionAvailability,
  MissionCandidate,
  MissionStartRequest,
  MissionStartResult,
  MissionCompleteRequest,
  MissionCompleteResult,
} from '@/types';

// ── 1. 미션 가용성 조회 ──
// POST /missions/availability
export async function getMissionAvailability(): Promise<MissionAvailability> {
  const res = await apiClient.get<ApiResponse<MissionAvailability>>('/missions/availability');
  const data = res.data;
  if (!data.isSuccess || !data.result) {
    throw new Error(data.message ?? '미션 가용성 조회 실패');
  }
  return data.result;
}

// ── 2. 미션 후보 조회 ──
// GET /missions/candidates
export async function getMissionCandidates(): Promise<MissionCandidate[]> {
  const res = await apiClient.get<ApiResponse<{ missions: MissionCandidate[] }>>('/missions/candidates');
  const data = res.data;
  if (!data.isSuccess || !data.result) {
    throw new Error(data.message ?? '미션 후보 조회 실패');
  }
  return data.result.missions;
}

// ── 3. 미션 시작 ──
// POST /missions/start
export async function startMission(body: MissionStartRequest): Promise<MissionStartResult> {
  const res = await apiClient.post<ApiResponse<MissionStartResult>>('/missions/start', body);
  const data = res.data;
  if (!data.isSuccess || !data.result) {
    throw new Error(data.message ?? '미션 시작 실패');
  }
  return data.result;
}

// ── 4. 미션 완료 ──
// POST /missions/complete
export async function completeMission(body: MissionCompleteRequest): Promise<MissionCompleteResult> {
  const res = await apiClient.post<ApiResponse<MissionCompleteResult>>('/missions/complete', body);
  const data = res.data;
  if (!data.isSuccess || !data.result) {
    throw new Error(data.message ?? '미션 완료 처리 실패');
  }
  return data.result;
}
