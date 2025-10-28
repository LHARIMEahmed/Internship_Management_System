//package com.example.security;
//
//import io.jsonwebtoken.*;
//import org.springframework.stereotype.Component;
//
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final String jwtSecret = "secretKey123456"; // Change-la plus tard !
//
//    private final int jwtExpirationMs = 86400000; // 24 heures
//
//    public String generateToken(String username) {
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
//                .signWith(SignatureAlgorithm.HS512, jwtSecret)
//                .compact();
//    }
//
//    public String getUsernameFromToken(String token) {
//        return Jwts.parser()
//                .setSigningKey(jwtSecret)
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            System.out.println("JWT validation error: " + e.getMessage());
//        }
//        return false;
//    }
//}
