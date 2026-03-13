package org.a504.fitCoin.domain.character.repository;

import org.a504.fitCoin.domain.character.entity.Characters;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterJpaRepository extends JpaRepository<Characters, Long> {
}
