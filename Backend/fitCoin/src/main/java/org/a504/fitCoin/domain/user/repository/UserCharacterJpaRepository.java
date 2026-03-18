package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.user.entity.UserCharacter;
import org.a504.fitCoin.domain.user.value.UserCharacterStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCharacterJpaRepository extends JpaRepository<UserCharacter, Long> {

    // 졸업 상태가 아닌 캐릭터가 존재하는지 확인
    Optional<UserCharacter> findByUserIdAndStatusNot(Long userId, UserCharacterStatus status);

    // 현재 캐릭터 조회
    Optional<UserCharacter> findByUserIdAndStatus(Long userId, UserCharacterStatus status);

}
