package backend.configuration;

import backend.entity.Role;
import backend.entity.User;
import backend.repository.RoleRepository;
import backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    
    @Bean
    @ConditionalOnProperty(
            prefix = "spring.datasource",
            name = "driver-class-name",
            havingValue = "com.mysql.cj.jdbc.Driver"
    )
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                // Tìm hoặc tạo role Admin
                Role adminRole = roleRepository.findByName("Admin")
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .name("Admin")
                                    .build();
                            return roleRepository.save(newRole);
                        });
                
                // Tạo user admin
                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .fullname("Administrator")
                        .status(1)
                        .role(adminRole)
                        .build();
                
                userRepository.save(user);
                log.warn("Admin user created with default password: admin123. Please change it after first login!");
            }
        };
    }
}
