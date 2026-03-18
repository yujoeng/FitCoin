package org.a504.fitCoin.domain.character.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.response.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CharacterErrorStatus implements BaseErrorCode {

    CHARACTER_NOT_FOUND(HttpStatus.NOT_FOUND, "CHARACTER-404", "캐릭터를 찾을 수 없습니다."),
    CHARACTER_ALREADY_ACTIVE(HttpStatus.CONFLICT, "CHARACTER-409", "이미 키우고 있는 캐릭터가 존재합니다."),
    CHARACTER_NOT_ACTIVE(HttpStatus.NOT_FOUND, "CHARACTER-404", "현재 키우고 있는 캐릭터가 없습니다."),
    CHARACTER_NOT_GRADUATABLE(HttpStatus.BAD_REQUEST, "CHARACTER-400", "졸업 가능한 상태가 아닙니다."),
    GIFTICON_NOT_FOUND(HttpStatus.NOT_FOUND, "CHARACTER-404", "지급 가능한 기프티콘이 없습니다. 관리자에게 문의해주세요.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public boolean isSuccess() {
        return false;
    }
}