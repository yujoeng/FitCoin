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

export interface UserInfo {
  email: string;
  nickname: string;
  exercise_level: ExerciseLevel;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  nickname: string;
}

export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateExerciseLevelRequest {
  exercise_level: ExerciseLevel;
}

export interface UpdateExerciseLevelResponse {
  exercise_level: ExerciseLevel;
}

export interface DeleteUserRequest {
  password: string;
}

/**
 * 내 정보 조회
 * GET /users/me
 */
export async function getUserInfo(): Promise<UserInfo> {
  const response = await apiClient.get<ApiResponse<UserInfo>>("/users/me"); // ✅ 수정
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
    "/users/me/nickname", // ✅ 수정
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
  await apiClient.patch("/users/me/password", data); // ✅ 수정
}

/**
 * 운동 레벨 변경
 * PATCH /users/me/exercise-level
 */
export async function updateExerciseLevel(
  data: UpdateExerciseLevelRequest,
): Promise<UpdateExerciseLevelResponse> {
  const response = await apiClient.patch<ApiResponse<UpdateExerciseLevelResponse>>("/users/me/exercise-level", data);
  return response.data.result;
}

/**
 * 회원 탈퇴
 * DELETE /users/me
 */
export async function deleteUser(data: DeleteUserRequest): Promise<void> {
  await apiClient.delete("/users/me", { data }); // ✅ 수정
}
// 이 파일이 하는 일: 마이페이지 관련 API 요청 함수들을 모아둔다.