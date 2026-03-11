package org.a504.fitCoin.domain.wallet.repository;

import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.wallet.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletJpaRepository extends JpaRepository<Wallet, Long> {
}
