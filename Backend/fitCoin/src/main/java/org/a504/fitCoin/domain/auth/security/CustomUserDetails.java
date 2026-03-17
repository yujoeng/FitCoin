package org.a504.fitCoin.domain.auth.security;

import org.a504.fitCoin.domain.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final String password;
    private final String username;
    private final Long userId;

    private CustomUserDetails(User user) {
        this.password = user.getPassword();
        this.username = user.getEmail();
        this.userId = user.getId();
    }

    private CustomUserDetails(String email, Long userId) {
        this.password = null;
        this.username = email;
        this.userId = userId;
    }

    public static CustomUserDetails forLogin(User user) {
        return new CustomUserDetails(user);
    }

    public static CustomUserDetails forJwt(String email, Long userId) {
        return new CustomUserDetails(email, userId);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public Long getUserId() {
        return userId;
    }
}
