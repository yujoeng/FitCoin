package org.a504.fitCoin.domain.asset.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.asset.repository.PointLogJpaRepository;
import org.a504.fitCoin.domain.asset.value.CoinReason;
import org.a504.fitCoin.domain.asset.value.PointReason;
import org.a504.fitCoin.domain.asset.value.TransactionType;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetVerificationService {

    private final CoinLogJpaRepository coinLogJpaRepository;
    private final PointLogJpaRepository pointLogJpaRepository;
    private final UserJpaRepository userJpaRepository;

    public record Discrepancy(Long userId, String asset, int actual, long expected) {
        @Override
        public String toString() {
            return String.format("userId=%d asset=%s actual=%d expected=%d diff=%d",
                    userId, asset, actual, expected, actual - expected);
        }
    }

    @Transactional(readOnly = true)
    public List<Discrepancy> verify() {
        List<CoinReason> coinEarnReasons = Arrays.stream(CoinReason.values())
                .filter(r -> r.transactionType == TransactionType.EARN)
                .collect(Collectors.toList());
        List<PointReason> pointEarnReasons = Arrays.stream(PointReason.values())
                .filter(r -> r.transactionType == TransactionType.EARN)
                .collect(Collectors.toList());

        // 로그 기반 유저별 순수 잔액 집계 (단일 쿼리)
        Map<Long, Long> expectedCoinByUser = coinLogJpaRepository
                .findNetCoinBalancePerUser(coinEarnReasons)
                .stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        Map<Long, Long> expectedPointByUser = pointLogJpaRepository
                .findNetPointBalancePerUser(pointEarnReasons)
                .stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        List<User> users = userJpaRepository.findAll();
        List<Discrepancy> discrepancies = new ArrayList<>();

        for (User user : users) {
            long expectedCoin  = expectedCoinByUser.getOrDefault(user.getId(), 0L);
            long expectedPoint = expectedPointByUser.getOrDefault(user.getId(), 0L);

            if (user.getCoin() != expectedCoin) {
                discrepancies.add(new Discrepancy(user.getId(), "coin", user.getCoin(), expectedCoin));
            }
            if (user.getPoint() != expectedPoint) {
                discrepancies.add(new Discrepancy(user.getId(), "point", user.getPoint(), expectedPoint));
            }
        }

        return discrepancies;
    }
}
