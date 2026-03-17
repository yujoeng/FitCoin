package org.a504.fitCoin.domain.auth.jwt;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.a504.fitCoin.global.config.property.JwtProperties;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final Long accessTokenValidity;
    private final Long refreshTokenValidity;

    public JwtUtil(JwtProperties jwtProperties) {
        this.secretKey = new SecretKeySpec(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.accessTokenValidity = jwtProperties.getAccessTokenValidity();
        this.refreshTokenValidity = jwtProperties.getRefreshTokenValidity();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String createAccessToken(String email) {

        return Jwts.builder()
                .claim("category", "access")
                .claim("email", email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(String email) {
        String identifier = NanoIdUtils.randomNanoId();

        return Jwts.builder()
                .claim("category", "refresh")
                .claim("identifier", identifier)
                .claim("email", email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(secretKey)
                .compact();
    }

    public String getIdentifier(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("identifier", String.class);
    }
}
