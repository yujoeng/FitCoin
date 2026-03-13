package org.a504.fitCoin.global.response.code;

import org.springframework.http.HttpStatus;

public interface BaseCode {
    HttpStatus getHttpStatus();
    boolean isSuccess();
    String getMessage();
}
