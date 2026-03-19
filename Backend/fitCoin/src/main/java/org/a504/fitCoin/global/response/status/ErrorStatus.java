package org.a504.fitCoin.global.response.status;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    // 전역 에러
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "GLOBAL-500", "서버 내부 오류가 발생했습니다. 자세한 사항은 백엔드 팀에 문의하세요."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "GLOBAL-400", "입력 값이 잘못된 요청 입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "GLOBAL-401", "인증이 필요 합니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "GLOBAL-403", "접근 권한이 없습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "GLOBAL-405", "허용되지 않은 요청 메소드입니다."),
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "GLOBAL-415", "지원되지 않는 미디어 타입입니다."),

    INVALID_UUID(HttpStatus.BAD_REQUEST, "GLOBAL-400", "올바르지 않은 UUID 형식입니다."),

    INVALID_ENUM_VALUE(HttpStatus.BAD_REQUEST, "GLOBAL-400", "유효하지 않은 ENUM 값입니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "GLOBAL-403", "접근이 거부되었습니다."),
    CONFLICT(HttpStatus.CONFLICT, "GLOBAL-409", "데이터 충돌이 발생했습니다. 이미 존재하는 리소스이거나 현재 상태에서 처리할 수 없습니다."),

    NOT_FOUND(HttpStatus.NOT_FOUND, "GLOBAL-404", "요청 데이터를 찾지 못했습니다."),

    // 미션 에러
    MISSION_NOT_FOUND(HttpStatus.BAD_REQUEST, "MS4001", "존재하지 않는 미션입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}
