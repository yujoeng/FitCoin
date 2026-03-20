package org.a504.fitCoin.domain.room.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RoomSuccessStatus implements BaseCode {

    ROOM_LAYOUT_UPDATED(HttpStatus.OK, "COMMON200", "가구 배치가 변경되었습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return true;
    }
}