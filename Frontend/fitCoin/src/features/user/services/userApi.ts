import apiClient from "@/services/apiClient";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type ExerciseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export const EXERCISE_LEVEL_LABELS: Record<ExerciseLevel, string> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

/** GET /users/me 응답 */
export interface UserInfo {
  email: string;
  nickname: string;
  exerciseLevel: ExerciseLevel;
}

/** PATCH /users/me/nickname 요청 바디 */
export interface UpdateNicknameRequest {
  nickname: string;
}

/** PATCH /users/me/nickname 응답 */
export interface UpdateNicknameResponse {
  nickname: string;
}

/** PATCH /users/me/password 요청 바디 */
export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

/** PATCH /users/me/exercise-level 요청/응답 (스웨거 기준 camelCase) */
export interface UpdateExerciseLevelRequest {
  exerciseLevel: ExerciseLevel;
}

export interface UpdateExerciseLevelResponse {
  exerciseLevel: ExerciseLevel;
}

/** DELETE /users/me 요청 바디 */
export interface DeleteUserRequest {
  password: string;
}

/**
 * 내 정보 조회
 * GET /users/me
 * 성공 → { email, nickname, exerciseLevel }
 */
export async function getUserInfo(): Promise<UserInfo> {
  const response = await apiClient.get<ApiResponse<UserInfo>>("/users/me");
  return response.data.result;
}

/**
 * 닉네임 변경
 * PATCH /users/me/nickname
 */
export async function updateNickname(
  data: UpdateNicknameRequest,
): Promise<UpdateNicknameResponse> {
  const response = await apiClient.patch<ApiResponse<UpdateNicknameResponse>>(
    "/users/me/nickname",
    data,
  );
  return response.data.result;
}

/**
 * 비밀번호 변경
 * PATCH /users/me/password
 */
export async function updatePassword(
  data: UpdatePasswordRequest,
): Promise<void> {
  await apiClient.patch("/users/me/password", data);
}

/**
 * 운동 레벨 변경
 * PATCH /users/me/exercise-level
 */
export async function updateExerciseLevel(
  data: UpdateExerciseLevelRequest,
): Promise<UpdateExerciseLevelResponse> {
  const response = await apiClient.patch<ApiResponse<UpdateExerciseLevelResponse>>(
    "/users/me/exercise-level",
    data,
  );
  return response.data.result;
}

/**
 * 회원 탈퇴
 * DELETE /users/me
 * Soft delete
 */
export async function deleteUser(data: DeleteUserRequest): Promise<void> {
  await apiClient.delete("/users/me", { data });
}
// 이 파일이 하는 일: 마이페이지 관련 API 요청 함수들을 모아둔다.
