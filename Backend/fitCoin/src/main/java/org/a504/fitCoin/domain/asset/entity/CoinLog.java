package org.a504.fitCoin.domain.asset.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.asset.value.CoinReason;
import org.a504.fitCoin.domain.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoinLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private int amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private CoinReason reason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public static CoinLog of(User user, int amount, CoinReason reason) {
        CoinLog log = new CoinLog();
        log.user = user;
        log.amount = amount;
        log.reason = reason;
        return log;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
