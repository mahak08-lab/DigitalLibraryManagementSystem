package com.mhk.config;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.mhk.entity.Role;
import com.mhk.entity.User;
import com.mhk.repository.UserRepository;

@Configuration
public class AdminDataInitializer {

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = User.builder()
                        .name(adminName)
                        .email(adminEmail)
                        .password(
                                passwordEncoder.encode(
                                        adminPassword))
                        .role(Role.ADMIN)
                        .createdAt(LocalDateTime.now())
                        .build();

                userRepository.save(admin);

                System.out.println(
                        "Admin account created successfully.");
            }
        };
    }
}