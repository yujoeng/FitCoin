package org.a504.fitCoin.global.response.status;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    // 전역 에러
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다. 자세한 사항은 백엔드 팀에 문의하세요."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "입력 값이 잘못된 요청 입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요 합니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 요청 메소드입니다."),
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "지원되지 않는 미디어 타입입니다."),

    INVALID_UUID(HttpStatus.BAD_REQUEST, "올바르지 않은 UUID 형식입니다."),

    INVALID_ENUM_VALUE(HttpStatus.BAD_REQUEST, "유효하지 않은 ENUM 값입니다.")
    ;

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}
