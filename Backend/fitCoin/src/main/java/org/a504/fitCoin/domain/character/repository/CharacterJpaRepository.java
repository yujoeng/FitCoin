package org.a504.fitCoin.domain.character.repository;

import org.a504.fitCoin.domain.character.entity.Character;
import org.a504.fitCoin.domain.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterJpaRepository extends JpaRepository<Character, Long> {
}
