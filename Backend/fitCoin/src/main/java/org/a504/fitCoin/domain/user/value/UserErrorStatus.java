package org.a504.fitCoin.domain.user.value;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UserErrorStatus implements BaseErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "US4041", "존재하지 않는 사용자입니다."),
    INSUFFICIENT_POINT(HttpStatus.BAD_REQUEST, "US4001", "포인트가 부족합니다."),
    INSUFFICIENT_COIN(HttpStatus.BAD_REQUEST, "US4002", "코인이 부족합니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}
