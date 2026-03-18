package org.a504.fitCoin.domain.advertisement.value;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AdErrorStatus implements BaseErrorCode {

    AD_NOT_FOUND(HttpStatus.NOT_FOUND, "AD4041", "등록된 광고가 없습니다."),
    AD_ALREADY_WATCHED_TODAY(HttpStatus.BAD_REQUEST, "AD4001", "오늘은 이미 광고를 시청하였습니다."),
    AD_ALREADY_IN_PROGRESS(HttpStatus.CONFLICT, "AD4091", "이미 진행 중인 광고 시청이 있습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}
