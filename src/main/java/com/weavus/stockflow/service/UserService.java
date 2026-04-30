package com.weavus.stockflow.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.weavus.stockflow.domain.Role;
import com.weavus.stockflow.domain.User;
import com.weavus.stockflow.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Transactional
	public void createInitialUserIfMissing(String email, String rawPassword, String name, Role role) {
		if (userRepository.existsByEmail(email)) {
			return;
		}

		User user = User.builder()
				.email(email)
				.password(passwordEncoder.encode(rawPassword))
				.name(name)
				.role(role)
				.accountStatus("ACTIVE")
				.mustChangePassword(false)
				.loginFailCount(0)
				.locked(false)
				.build();

		userRepository.save(user);
	}
}
