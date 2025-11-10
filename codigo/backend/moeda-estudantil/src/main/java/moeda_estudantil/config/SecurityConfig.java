package moeda_estudantil.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // desativa proteção CSRF
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // permite tudo (por enquanto)
                )
                .formLogin(form -> form.disable()) // remove página /login do Spring
                .httpBasic(basic -> basic.disable()); // desativa autenticação básica

        return http.build();
    }
}
