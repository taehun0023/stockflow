package com.weavus.stockflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@Configuration
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/login", "/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()
						.requestMatchers("/dashboard").hasRole("ADMIN")
						.requestMatchers("/rentals", "/rentals/**").hasRole("ADMIN")
						.anyRequest().authenticated())
				.formLogin(form -> form
						.loginPage("/login")
						.loginProcessingUrl("/login")
						.usernameParameter("email")
						.passwordParameter("password")
						.successHandler((request, response, authentication) -> {
							boolean admin = authentication.getAuthorities().stream()
									.anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
							response.sendRedirect(admin ? "/dashboard" : "/mypage");
						})
						.failureUrl("/login?error")
						.permitAll())
				.logout(logout -> logout
						.logoutRequestMatcher(PathPatternRequestMatcher.pathPattern(HttpMethod.GET, "/logout"))
						.logoutSuccessUrl("/login?logout")
						.invalidateHttpSession(true)
						.clearAuthentication(true)
						.deleteCookies("JSESSIONID")
						.permitAll())
				.exceptionHandling(exception -> exception
						.accessDeniedPage("/access-denied"))
				.sessionManagement(session -> session
						.invalidSessionUrl("/login?expired"));

		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
