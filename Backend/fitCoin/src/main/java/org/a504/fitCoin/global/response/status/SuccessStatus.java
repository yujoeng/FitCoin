package org.a504.fitCoin.global.response.status;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SuccessStatus implements BaseCode {

    OK(HttpStatus.OK, "요청 응답에 성공했습니다."),
    CREATED(HttpStatus.CREATED, "생성에 성공했습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public boolean isSuccess() {
        return true;
    }
}
