package org.a504.fitCoin.domain.character.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CharacterErrorStatus implements BaseErrorCode {

    CHARACTER_NOT_FOUND(HttpStatus.NOT_FOUND, "CHARACTER-404", "캐릭터를 찾을 수 없습니다."),
    CHARACTER_ALREADY_ACTIVE(HttpStatus.CONFLICT, "CHARACTER-409", "이미 키우고 있는 캐릭터가 존재합니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}