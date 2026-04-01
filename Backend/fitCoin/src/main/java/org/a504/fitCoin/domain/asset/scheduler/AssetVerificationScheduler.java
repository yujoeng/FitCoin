package org.a504.fitCoin.domain.asset.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.asset.service.AssetVerificationService;
import org.a504.fitCoin.domain.asset.service.AssetVerificationService.Discrepancy;
import org.a504.fitCoin.global.util.MailClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class AssetVerificationScheduler {

    private final AssetVerificationService assetVerificationService;
    private final MailClient mailClient;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Scheduled(cron = "0 0 3 * * *", zone = "Asia/Seoul")
    public void verify() {
        log.info("[AssetVerification] 포인트/코인 정합성 검증 시작");

        List<Discrepancy> discrepancies = assetVerificationService.verify();

        if (discrepancies.isEmpty()) {
            log.info("[AssetVerification] 이상 없음. 모든 유저의 잔액이 로그와 일치합니다.");
            return;
        }

        // 불일치 항목별 경고 로그
        discrepancies.forEach(d -> log.warn("[AssetVerification] 불일치 감지: {}", d));

        // 관리자 이메일 알림
        String body = discrepancies.stream()
                .map(Discrepancy::toString)
                .collect(Collectors.joining("\n"));

        mailClient.sendEmail(
                adminEmail,
                "[FitCoin] 포인트/코인 정합성 오류 감지 (" + discrepancies.size() + "건)",
                "<pre>" + body + "</pre>"
        );

        log.warn("[AssetVerification] 검증 완료 — 불일치 {}건 감지. 관리자에게 알림 발송.", discrepancies.size());
    }
}
