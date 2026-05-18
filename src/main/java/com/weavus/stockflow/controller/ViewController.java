package com.weavus.stockflow.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.weavus.stockflow.security.StockflowUserDetails;

@Controller
public class ViewController {

	@GetMapping({
			"/equipments",
			"/rental-detail",
			"/reservation-detail",
			"/request-detail-employee",
			"/rental-apply",
			"/mypage",
			"/employee-detail",
			"/rentals-employee",
			"/employees",
			"/favorites",
			"/reservations-employee",
			"/requests-employee",
			"/request-detail",
			"/register-equipment",
			"/profile",
			"/operation-history",
			"/csv-inventory",
			"/csv-import-result",
			"/access-denied"
	})
	public String page(org.springframework.web.context.request.WebRequest request) {
		return request.getDescription(false).replace("uri=/", "");
	}

	@GetMapping("/rentals")
	public String rentals(Authentication authentication) {
		return isAdmin(authentication) ? "rentals" : "rentals-employee";
	}

	@GetMapping("/rentals/{rentalId}")
	public String rentalDetail(@PathVariable String rentalId) {
		return "rental-detail";
	}

	@GetMapping("/equipments/{equipmentId}")
	public String equipmentDetail(@PathVariable String equipmentId) {
		return "equipments";
	}

	@GetMapping("/reservations")
	public String reservations(Authentication authentication) {
		return isAdmin(authentication) ? "reservations" : "reservations-employee";
	}

	@GetMapping("/requests")
	public String requests(Authentication authentication) {
		return isAdmin(authentication) ? "requests" : "requests-employee";
	}

	@GetMapping("/requests/new")
	public String requestNew() {
		return "request-new";
	}

	private boolean isAdmin(Authentication authentication) {
		if (authentication == null || !(authentication.getPrincipal() instanceof StockflowUserDetails userDetails)) {
			return false;
		}
		return userDetails.getUser().getRole().name().equals("ADMIN");
	}
}
