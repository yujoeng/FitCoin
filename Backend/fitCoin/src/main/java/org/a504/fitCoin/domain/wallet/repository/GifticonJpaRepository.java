package org.a504.fitCoin.domain.wallet.repository;

import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GifticonJpaRepository extends JpaRepository<Gifticon, Long> {
}
