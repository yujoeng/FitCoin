package org.a504.fitCoin.global.config.property;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "email")
@Getter
@Setter
public class EmailProperties {
    private Code code;
    private Token token;

    @Getter
    @Setter
    public static class Code {
        private Long expiredTime;
    }

    @Getter
    @Setter
    public static class Token {
        private Long expiredTime;
    }
}