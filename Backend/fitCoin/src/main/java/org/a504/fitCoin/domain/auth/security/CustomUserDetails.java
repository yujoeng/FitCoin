package org.a504.fitCoin.domain.auth.security;

import org.a504.fitCoin.domain.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final String password;
    private final String username;

    private CustomUserDetails(User user) {
        this.password = user.getPassword();
        this.username = user.getEmail();
    }

    public static CustomUserDetails forLogin(User user) {
        return new CustomUserDetails(user);
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
}
