package com.MantriVenkatRaj.librarymanagement.jwt;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

/**
 * Small helper to validate and parse JWTs. Reuses the application's JwtDecoder bean.
 */
@Component
public class JwtTokenProvider {

    private final JwtDecoder jwtDecoder;

    public JwtTokenProvider(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    /**
     * Validates the token by trying to decode it. Returns true if valid.
     */
    public boolean validateToken(String token) {
        try {
            jwtDecoder.decode(token);
            return true;
        } catch (JwtException ex) {
            // token invalid/expired/signature fail
            return false;
        }
    }

    /**
     * Returns the subject/username from the token (or null if invalid).
     */
    public String getUsername(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            return jwt.getSubject();
        } catch (JwtException ex) {
            return null;
        }
    }

    /**
     * Returns GrantedAuthority collection parsed from the 'scope' claim.
     * If you used a different claim name, change "scope" accordingly.
     */
    public Collection<? extends GrantedAuthority> getAuthorities(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            Object scopeObj = jwt.getClaim("scope");
            if (scopeObj == null) return Collections.emptyList();

            String scope = String.valueOf(scopeObj);
            if (scope.isBlank()) return Collections.emptyList();

            return Arrays.stream(scope.split(" "))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        } catch (JwtException ex) {
            return Collections.emptyList();
        }
    }
}
