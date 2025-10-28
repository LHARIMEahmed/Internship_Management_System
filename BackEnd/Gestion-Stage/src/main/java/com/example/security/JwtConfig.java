package com.example.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:defaultSecretKeyToBeReplacedInProductionEnvironment}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 heures par défaut
    private long jwtExpiration;

    @Bean
    public String getJwtSecret() {
        return jwtSecret;
    }

    @Bean
    public long getJwtExpiration() {
        return jwtExpiration;
    }
}