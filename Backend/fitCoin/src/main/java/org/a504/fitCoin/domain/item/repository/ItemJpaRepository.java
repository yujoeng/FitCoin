package org.a504.fitCoin.domain.item.repository;

import org.a504.fitCoin.domain.item.entity.Item;
import org.a504.fitCoin.domain.mission.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemJpaRepository extends JpaRepository<Item, Long> {
}
