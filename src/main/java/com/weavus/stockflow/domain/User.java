package com.weavus.stockflow.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 255)
	private String email;

	@Column(nullable = false, length = 255)
	private String password;

	@Column(nullable = false, length = 100)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Role role;

	@Column(length = 100)
	private String department;

	@Column(length = 30)
	private String phone;

	@Column(name = "account_status", nullable = false, length = 20)
	private String accountStatus;

	@Column(name = "must_change_password", nullable = false)
	private boolean mustChangePassword;

	@Column(name = "login_fail_count", nullable = false)
	private int loginFailCount;

	@Column(nullable = false)
	private boolean locked;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Builder
	private User(String email, String password, String name, Role role, String department, String phone,
			String accountStatus, Boolean mustChangePassword, Integer loginFailCount, Boolean locked) {
		this.email = email;
		this.password = password;
		this.name = name;
		this.role = role;
		this.department = department;
		this.phone = phone;
		this.accountStatus = accountStatus == null ? "ACTIVE" : accountStatus;
		this.mustChangePassword = mustChangePassword != null && mustChangePassword;
		this.loginFailCount = loginFailCount == null ? 0 : loginFailCount;
		this.locked = locked != null && locked;
	}

	public boolean isActive() {
		return "ACTIVE".equalsIgnoreCase(accountStatus);
	}
}
