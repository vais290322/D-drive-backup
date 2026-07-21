package com.rahul.Drasta.auth.service;

import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        if (!user.isActive() || user.isBlocked()) {
            throw new UsernameNotFoundException("User is inactive or blocked");
        }
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());
//        GrantedAuthority authority = new SimpleGrantedAuthority( user.getRole());
        List<GrantedAuthority> authorities = List.of(authority);

//        System.out.println("i m authority : "+authorities);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
