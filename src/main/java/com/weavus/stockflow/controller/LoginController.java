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
			return "redirect:/dashboard";
		}
		return "redirect:/login";
	}

	@GetMapping("/login")
	public String login(@RequestParam(value = "error", required = false) String error,
			@RequestParam(value = "logout", required = false) String logout,
			Authentication authentication,
			Model model) {
		if (authentication != null && authentication.isAuthenticated()) {
			return "redirect:/dashboard";
		}
		if (error != null) {
			model.addAttribute("showError", true);
			model.addAttribute("error", "メールアドレスまたはパスワードが正しくありません。");
		}
		if (logout != null) {
			model.addAttribute("showSuccess", true);
			model.addAttribute("success", "ログアウトしました。");
		}
		return "login";
	}
}
