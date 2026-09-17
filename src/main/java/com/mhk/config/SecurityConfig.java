
package com.mhk.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mhk.service.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================

    @Bean
    public AuthenticationProvider authenticationProvider(
            CustomUserDetailsService customUserDetailsService) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        customUserDetailsService
                );

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }


    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5500",
                        "http://127.0.0.1:5500",
                        "https://welcoming-happiness-production-e491.up.railway.app"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // CORS
            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )

            // CSRF
            .csrf(csrf ->
                    csrf.disable()
            )

            // JWT = STATELESS
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // =================================================
            // AUTHORIZATION
            // =================================================

            .authorizeHttpRequests(auth -> auth

                // -------------------------
                // PUBLIC
                // -------------------------

                .requestMatchers(
                        "/api/users/register"
                ).permitAll()

                .requestMatchers(
                        "/api/users/login"
                ).permitAll()

                .requestMatchers(
                        "/api/books/search/**"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/books"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()


                // -------------------------
                // ADMIN - BOOKS
                // -------------------------

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


                // -------------------------
                // USER - LOANS
                // -------------------------

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


                // -------------------------
                // USER - BOOKINGS
                // -------------------------

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/bookings"
                ).hasAuthority("ROLE_USER")

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/bookings/my"
                ).hasAuthority("ROLE_USER")


                // -------------------------
                // USER - CONTACT
                // -------------------------

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/contact"
                ).hasAuthority("ROLE_USER")


                // -------------------------
                // ADMIN - CONTACT
                // -------------------------

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/contact"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                        HttpMethod.PATCH,
                        "/api/contact/*/resolve"
                ).hasAuthority("ROLE_ADMIN")


                // -------------------------
                // ADMIN - ISSUED BOOKS
                // -------------------------

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/loans/issued"
                ).hasAuthority("ROLE_ADMIN")


                // -------------------------
                // ADMIN - FINES
                // -------------------------

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/admin/loans/fines"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/admin/loans/*/pay-fine"
                ).hasAuthority("ROLE_ADMIN")


                // -------------------------
                // ADMIN - USERS
                // -------------------------

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/admin/users/**"
                ).hasAuthority("ROLE_ADMIN")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/admin/users/**"
                ).hasAuthority("ROLE_ADMIN")


                // -------------------------
                // EVERYTHING ELSE
                // -------------------------

                .anyRequest().authenticated()
            )

            // =================================================
            // JWT FILTER
            // =================================================

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}

