package org.a504.fitCoin.domain.mission.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class MissionTokenProvider {

    private final Key key;

    public MissionTokenProvider(@Value("${JWT_SECRET}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateMissionToken(Long userId, Long missionId, LocalDateTime missionStartedAt) {
        Date startedAt = Date.from(missionStartedAt.atZone(ZoneId.systemDefault()).toInstant());

        return Jwts.builder()
                .claim("userId", userId)
                .claim("missionId", missionId)
                .claim("missionStartedAt", startedAt)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}