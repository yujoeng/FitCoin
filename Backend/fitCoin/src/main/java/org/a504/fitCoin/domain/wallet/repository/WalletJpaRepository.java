package org.a504.fitCoin.domain.wallet.repository;

import org.a504.fitCoin.domain.wallet.entity.UserGifticon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletJpaRepository extends JpaRepository<UserGifticon, Long> {
}
