package com.weavus.stockflow.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

	@GetMapping("/")
	public String root(Authentication authentication) {
		if (authentication != null && authentication.isAuthenticated()) {
			return redirectByRole(authentication);
		}
		return "redirect:/login";
	}

	@GetMapping("/login")
	public String login(@RequestParam(value = "error", required = false) String error,
			@RequestParam(value = "logout", required = false) String logout,
			@RequestParam(value = "expired", required = false) String expired,
			@RequestParam(value = "locked", required = false) String locked,
			Authentication authentication,
			Model model) {
		if (authentication != null && authentication.isAuthenticated()) {
			return redirectByRole(authentication);
		}
		if (error != null) {
			model.addAttribute("showError", true);
			model.addAttribute("error", "メールアドレスまたはパスワードが正しくありません。");
		}
		if (logout != null) {
			model.addAttribute("showSuccess", true);
			model.addAttribute("success", "ログアウトしました。");
		}
		if (expired != null) {
			model.addAttribute("showSessionExpired", true);
		}
		if (locked != null) {
			model.addAttribute("showAccountLocked", true);
		}
		return "login";
	}

	private String redirectByRole(Authentication authentication) {
		boolean admin = authentication.getAuthorities().stream()
				.anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
		return admin ? "redirect:/dashboard" : "redirect:/mypage";
	}
}
