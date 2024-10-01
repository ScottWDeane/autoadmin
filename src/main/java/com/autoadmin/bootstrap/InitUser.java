package com.autoadmin.bootstrap;

import com.autoadmin.entity.security.Authority;
import com.autoadmin.entity.security.User;
import com.autoadmin.repository.security.AuthorityRepository;
import com.autoadmin.repository.security.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
public class InitUser {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @PostConstruct
    public void init() {
        if (userRepository.findAll().isEmpty()) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("Pa$$wor_D"));
            user.setEnabled(true);

            Authority authority = new Authority();
            authority.setAuthority("ROLE_USER");
            authority.setUser(user);

            user.setAuthorities(Collections.singleton(authority));

            userRepository.save(user);
            authorityRepository.save(authority);
        }
    }

}
