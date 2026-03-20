package org.a504.fitCoin.domain.room.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RoomErrorStatus implements BaseErrorCode {

    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "ROOM-404", "해당 유저의 방이 존재하지 않습니다."),
    FURNITURE_NOT_FOUND(HttpStatus.NOT_FOUND, "FURNITURE-404", "존재하지 않는 가구입니다."),
    FURNITURE_NOT_OWNED(HttpStatus.FORBIDDEN, "FURNITURE-403", "보유하지 않은 가구입니다."),
    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}