package org.a504.fitCoin.domain.character.repository;

import org.a504.fitCoin.domain.character.entity.CharacterDetail;
import org.a504.fitCoin.domain.character.value.CharacterStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterDetailJpaRepository extends JpaRepository<CharacterDetail, Long> {

    // 캐릭터의 상태(DEFAULT/GRADUATED)에 해당하는 이미지 URL 조회
    Optional<CharacterDetail> findByCharactersIdAndStatus(Long charactersId, CharacterStatus status);

    // 캐릭터의 모든 이미지 조회 (DEFAULT, GRADUATED)
    List<CharacterDetail> findByCharactersId(Long charactersId);
}