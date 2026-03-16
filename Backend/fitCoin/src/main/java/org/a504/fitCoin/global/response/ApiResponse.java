package org.a504.fitCoin.global.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.a504.fitCoin.global.response.code.BaseCode;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.ResponseEntity;

public record ApiResponse<T>(
        Boolean isSuccess,
        String code,
        String message,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        T result
) {

    // 성공 + 데이터
    public static <T> ResponseEntity<ApiResponse<T>> onSuccess(BaseCode code, T result) {
        ApiResponse<T> body = new ApiResponse<>(
                code.isSuccess(),
                code.getCode(),
                code.getMessage(),
                result
        );
        return ResponseEntity.status(code.getHttpStatus()).body(body);
    }

    // 성공 + 데이터 없음
    public static ResponseEntity<ApiResponse<Void>> onSuccess(BaseCode code) {
        ApiResponse<Void> body = new ApiResponse<>(
                code.isSuccess(),
                code.getCode(),
                code.getMessage(),
                null
        );
        return ResponseEntity.status(code.getHttpStatus()).body(body);
    }

    // 실패 + 기본 메시지
    public static ResponseEntity<ApiResponse<Void>> onFailure(BaseErrorCode code) {
        ApiResponse<Void> body = new ApiResponse<>(
                code.isSuccess(),   // 항상 false
                code.getCode(),
                code.getMessage(),
                null
        );
        return ResponseEntity.status(code.getHttpStatus()).body(body);
    }

    // 실패 + 커스텀 메시지
    public static ResponseEntity<ApiResponse<Void>> onFailure(BaseErrorCode code, String message) {
        ApiResponse<Void> body = new ApiResponse<>(
                code.isSuccess(),   // 항상 false
                code.getCode(),
                message,
                null
        );
        return ResponseEntity.status(code.getHttpStatus()).body(body);
    }

    // 실패 + 커스텀 메시지 + result
    public static <T> ResponseEntity<ApiResponse<T>> onFailure(BaseErrorCode code, String message, T result) {
        ApiResponse<T> body = new ApiResponse<>(
                code.isSuccess(),   // 항상 false
                code.getCode(),
                message,
                result
        );
        return ResponseEntity.status(code.getHttpStatus()).body(body);
    }
}
