package org.a504.fitCoin.global.response.status;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SuccessStatus implements BaseCode {

    OK(HttpStatus.OK, "GLOBAL-200", "요청 응답에 성공했습니다."),
    CREATED(HttpStatus.CREATED, "GLOBAL-201", "생성에 성공했습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return true;
    }


}
