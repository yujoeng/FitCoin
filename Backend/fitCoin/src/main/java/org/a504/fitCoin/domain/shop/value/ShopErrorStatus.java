package org.a504.fitCoin.domain.shop.value;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ShopErrorStatus implements BaseErrorCode {

    NO_FURNITURE_AVAILABLE(HttpStatus.NOT_FOUND, "SH4041", "뽑을 수 있는 가구가 없습니다."),
    NO_GIFTICON_AVAILABLE(HttpStatus.NOT_FOUND, "SH4042", "뽑을 수 있는 기프티콘이 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}
