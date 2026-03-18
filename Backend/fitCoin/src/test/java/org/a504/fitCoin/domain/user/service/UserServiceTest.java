package org.a504.fitCoin.domain.user.service;

import org.a504.fitCoin.domain.user.dto.response.MyPageResponse;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserJpaRepository userJpaRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void 정상_유저_조회() {
        User user = User.builder()
                .email("test@test.com")
                .password("password")
                .nickname("tester")
                .exerciseLevel(ExerciseLevel.BEGINNER)
                .build();

        given(userJpaRepository.findById(1L)).willReturn(Optional.of(user));

        MyPageResponse response = userService.getMyInfo(1L);

        assertThat(response.email()).isEqualTo("test@test.com");
        assertThat(response.nickname()).isEqualTo("tester");
        assertThat(response.exerciseLevel()).isEqualTo(ExerciseLevel.BEGINNER);
    }

    @Test
    void 존재하지_않는_유저_조회시_NOT_FOUND() {
        given(userJpaRepository.findById(1L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getMyInfo(1L))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode()).isEqualTo(ErrorStatus.NOT_FOUND));
    }

    @Test
    void 탈퇴한_유저_조회시_BAD_REQUEST() throws Exception {
        User user = User.builder()
                .email("deleted@test.com")
                .password("password")
                .nickname("deleted")
                .exerciseLevel(ExerciseLevel.BEGINNER)
                .build();

        Field deletedAtField = User.class.getDeclaredField("deletedAt");
        deletedAtField.setAccessible(true);
        deletedAtField.set(user, LocalDateTime.now());

        given(userJpaRepository.findById(1L)).willReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.getMyInfo(1L))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode()).isEqualTo(ErrorStatus.BAD_REQUEST));
    }
}
