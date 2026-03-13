package org.a504.fitCoin.global.exception;

import lombok.Getter;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {

    private final BaseErrorCode errorCode;

    public CustomException(BaseErrorCode errorCode) {
        super(errorCode.getMessage()); // RuntimeException(message) 세팅
        this.errorCode = errorCode;
    }

    @Override
    public String getMessage() {
        return errorCode.getMessage();
    }

    public HttpStatus getHttpStatus() {
        return errorCode.getHttpStatus();
    }
}
