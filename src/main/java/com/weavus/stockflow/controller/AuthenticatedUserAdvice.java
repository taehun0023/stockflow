package com.weavus.stockflow.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.weavus.stockflow.domain.User;
import com.weavus.stockflow.security.StockflowUserDetails;

@ControllerAdvice
public class AuthenticatedUserAdvice {

	@ModelAttribute("user")
	public User currentUser(Authentication authentication) {
		if (authentication == null || !(authentication.getPrincipal() instanceof StockflowUserDetails userDetails)) {
			return null;
		}
		return userDetails.getUser();
	}
}
