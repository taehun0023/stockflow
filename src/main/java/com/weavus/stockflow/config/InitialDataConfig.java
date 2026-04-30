package com.weavus.stockflow.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.weavus.stockflow.domain.Role;
import com.weavus.stockflow.service.UserService;

@Configuration
public class InitialDataConfig {

	@Bean
	CommandLineRunner initialUsers(UserService userService) {
		return args -> {
			userService.createInitialUserIfMissing("admin@test.com", "1234", "관리자", Role.ADMIN);
			userService.createInitialUserIfMissing("user@test.com", "1234", "이용자", Role.USER);
		};
	}
}
