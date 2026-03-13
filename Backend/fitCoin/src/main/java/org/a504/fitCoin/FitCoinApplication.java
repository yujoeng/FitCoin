package org.a504.fitCoin;

import org.a504.fitCoin.global.config.property.CorsConfigProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CorsConfigProperties.class)
public class FitCoinApplication {
	public static void main(String[] args) {
		SpringApplication.run(FitCoinApplication.class, args);
	}
}
