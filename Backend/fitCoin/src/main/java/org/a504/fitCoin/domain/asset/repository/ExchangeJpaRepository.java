package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExchangeJpaRepository extends JpaRepository<Exchange, Long> {

    Optional<Exchange> findByBaseDate(LocalDate baseDate);

    Optional<Exchange> findTopByOrderByBaseDateDesc();

    List<Exchange> findAllByOrderByBaseDateAsc();
}
