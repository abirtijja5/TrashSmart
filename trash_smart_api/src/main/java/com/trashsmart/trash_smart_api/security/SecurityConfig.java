package com.trashsmart.trash_smart_api.security;


import com.trashsmart.trash_smart_api.security.filters.JwtAuthFilter;
import com.trashsmart.trash_smart_api.security.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

   @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
         http
            // Désactiver CSRF (pour simplifier l'accès à H2)
            .csrf(AbstractHttpConfigurer::disable)
            // Nécessaire pour accéder à la console H2 (affichage dans un iframe)
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
            // Configurer la gestion stateless des sessions
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Définir les règles d'autorisation
            .authorizeHttpRequests(auth -> auth
                    //.anyRequest().permitAll());
                        // Autoriser l'accès à la console H2
                        .requestMatchers("/api/auth/**","/h2-console/**").permitAll()
                          // Autoriser l'accès aux endpoints  sans permissions
                         // .requestMatchers("/users/**","/users/id/**","/roles/**", "/addRoleToUser/**","swagger-ui.html").permitAll()
                       .anyRequest().authenticated())
            .userDetailsService(userDetailsServiceImpl)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


