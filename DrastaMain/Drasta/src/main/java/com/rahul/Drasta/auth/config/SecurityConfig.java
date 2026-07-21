package com.rahul.Drasta.auth.config;

import com.rahul.Drasta.auth.filter.JwtAuthenticationFilter;
import com.rahul.Drasta.auth.service.CustomUserDetailsService;
import com.rahul.Drasta.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final JwtUtil jwtUtil;
    private final TokenBlacklist tokenBlacklist;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/register", "/api/v1/login", "/api/v1/logout", "/api/v1/forgot-password", "/api/v1/reset-password", "/api/v1/auth/refresh","/api/v1/donate/**").permitAll()
                        .requestMatchers("/api/v1/blogs/**","/api/v1/achievements/**","/api/v1/gallery/**","/api/v1/initiatives/**","/api/v1/events/**","/api/v1/volunteer/**","/api/v1/event-participation/**","/api/v1/volunteer-certificate/**,","/api/v1/notice/**","/api/v1/volunteer-certificate/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .logout(logout -> logout
                        .logoutUrl("/api/v1/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            SecurityContextHolder.clearContext();
                            response.setContentType("application/json");
                            response.getWriter().write("{\"status\": \"success\", \"message\": \"You have been signed out\"}");
                        })
                        .deleteCookies("_auth-token", "refresh_token")
                        .invalidateHttpSession(true)
                );

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService, tokenBlacklist);
    }
}
