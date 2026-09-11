package com.mhk.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Password encryption
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    // Security Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            // Disable CSRF for REST APIs
            .csrf(csrf -> csrf.disable())

            // JWT authentication - no HTTP session
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC USER APIs
                // =========================
                .requestMatchers(
                    "/api/users/register"
                ).permitAll()

                .requestMatchers(
                    "/api/users/login"
                ).permitAll()


                // =========================
                // PUBLIC BOOK APIs
                // =========================
                .requestMatchers(
                    "/api/books/search/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/books"
                ).permitAll()


                // =========================
                // ADMIN - BOOK MANAGEMENT
                // =========================
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/books"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/books/**"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/books/**"
                ).hasAuthority("ROLE_ADMIN")


                // =========================
                // USER - LOANS
                // =========================
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/loans/issue"
                ).hasAuthority("ROLE_USER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/loans/*/return"
                ).hasAuthority("ROLE_USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/loans/my"
                ).hasAuthority("ROLE_USER")


                // =========================
                // USER - BOOKING
                // =========================
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/bookings"
                ).hasAuthority("ROLE_USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/bookings/my"
                ).hasAuthority("ROLE_USER")


                // =========================
                // USER - CONTACT QUERY
                // =========================
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/contact"
                ).hasAuthority("ROLE_USER")


                // =========================
                // ADMIN - CONTACT QUERY
                // =========================
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/contact"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/contact/*/resolve"
                ).hasAuthority("ROLE_ADMIN")


                // =========================
                // ADMIN - LOANS
                // =========================
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/loans/issued"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/admin/loans/*/pay-fine"
                ).hasAuthority("ROLE_ADMIN")


                // =========================
                // ADMIN - USERS
                // =========================
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/users/**"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/admin/users/**"
                ).hasAuthority("ROLE_ADMIN")


                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest().authenticated()
            )

            // JWT Filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}