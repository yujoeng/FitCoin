package org.a504.fitCoin.global.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // 커스텀 예외
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        logError("CustomException", e);
        return ApiResponse.onFailure(e.getErrorCode());
    }

    // Security 인증 관련 (java.lang.SecurityException)
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<Void>> handleSecurityException(SecurityException e) {
        logError("SecurityException", e);
        return ApiResponse.onFailure(ErrorStatus.UNAUTHORIZED);
    }

    // AuthenticationException, AccessDeniedException
    @ExceptionHandler({AuthenticationException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<Void>> handleSecurityException(Exception e) {

        BaseErrorCode errorCode;

        if (e instanceof AuthenticationException) {
            // 401 Unauthorized
            // CustomException인지 확인해서 꺼냄
            if (e.getCause() instanceof CustomException customException) {
                errorCode = customException.getErrorCode(); // 구체적인 코드 사용
            } else {
                errorCode = ErrorStatus.UNAUTHORIZED; // 원인 모를 401은 그냥 "인증 필요"로 처리
            }
            logError("Authentication failure", e.getMessage());

        } else {
            // 403 Forbidden
            // AccessDeniedException도 혹시 내부에 CustomException이 있을 수 있으니 체크
            if (e.getCause() instanceof CustomException customException) {
                errorCode = customException.getErrorCode();
            } else {
                errorCode = ErrorStatus.ACCESS_DENIED;
            }
            logError("Access denied", e.getMessage());
        }

        return ApiResponse.onFailure(errorCode);
    }

    // 내부 서버 에러 (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        logError("Unhandled exception", e);
        return ApiResponse.onFailure(ErrorStatus.INTERNAL_SERVER_ERROR);
    }

    // ====== Validation / 요청 형식 관련 필수 예외 ======

    // @Valid RequestBody 필드 검증 실패
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        Map<String, String> errorMap = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String key;

            if (error instanceof FieldError) {
                key = ((FieldError) error).getField();
            } else {
                key = error.getObjectName();
            }

            String message = error.getDefaultMessage();
            errorMap.put(key, message);
        });

        logError("Validation error", errorMap.toString());

        return toObjectResponse(ApiResponse.onFailure(ErrorStatus.BAD_REQUEST, "입력값이 올바르지 않습니다.", errorMap));
    }

    // @Validated 쿼리 파라미터/PathVariable 검증 실패
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationParameterError(ConstraintViolationException ex) {
        String errorMessage = ex.getMessage();
        logError("ConstraintViolationException", errorMessage);
        return ApiResponse.onFailure(ErrorStatus.BAD_REQUEST, errorMessage);
    }

    // 필수 쿠키 누락
    @ExceptionHandler(MissingRequestCookieException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingCookie(MissingRequestCookieException e) {
        String errorMessage = "필수 쿠키 '" + e.getCookieName() + "'가 없습니다.";
        logError("MissingRequestCookieException", errorMessage);
        return ApiResponse.onFailure(ErrorStatus.UNAUTHORIZED, errorMessage);
    }

    // 필수 쿼리 파라미터 누락
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        String errorMessage = "필수 파라미터 '" + ex.getParameterName() + "'가 없습니다.";
        logError("MissingServletRequestParameterException", errorMessage);
        return toObjectResponse(ApiResponse.onFailure(ErrorStatus.BAD_REQUEST, errorMessage));
    }

    // JSON 파싱/역직렬화 실패 (enum 값 포함)
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        if (ex.getCause() instanceof InvalidFormatException formatException) {
            if (formatException.getTargetType().isEnum()) {
                String errorMessage =
                        "올바르지 않은 enum 값입니다. 허용되지 않은 값: " + formatException.getValue();
                logError("Invalid enum value", errorMessage);
                return toObjectResponse(
                        ApiResponse.onFailure(ErrorStatus.BAD_REQUEST, errorMessage)
                );
            }
        }
        String errorMessage = "요청 본문이 잘못되었습니다.";
        logError("HttpMessageNotReadableException", errorMessage);
        return toObjectResponse(ApiResponse.onFailure(ErrorStatus.BAD_REQUEST, errorMessage));
    }

    // 지원하지 않는 HTTP 메소드
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        String errorMessage = "지원하지 않는 HTTP 메소드 요청입니다: " + ex.getMethod();
        logError("HttpRequestMethodNotSupportedException", errorMessage);
        return toObjectResponse(ApiResponse.onFailure(ErrorStatus.METHOD_NOT_ALLOWED, errorMessage));
    }

    // 지원하지 않는 Media Type
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        String errorMessage = "지원하지 않는 미디어 타입입니다: " + ex.getContentType();
        logError("HttpMediaTypeNotSupportedException", errorMessage);
        return toObjectResponse(ApiResponse.onFailure(ErrorStatus.UNSUPPORTED_MEDIA_TYPE, errorMessage));
    }

    // ====== private 유틸 메서드 ======

    private String extractFieldErrors(List<FieldError> fieldErrors) {
        return fieldErrors.stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
    }

    private void logError(String message, Object errorDetails) {
        if (errorDetails instanceof Throwable t) {
            log.error("{}: {}", message, t.getMessage());
        } else {
            log.error("{}: {}", message, errorDetails);
        }
    }

    @SuppressWarnings("unchecked")
    private <T> ResponseEntity<Object> toObjectResponse(ResponseEntity<ApiResponse<T>> response) {
        // ResponseEntity<ApiResponse<T>> -> ResponseEntity<Object> 로 캐스팅
        return (ResponseEntity<Object>) (ResponseEntity<?>) response;
    }
}
