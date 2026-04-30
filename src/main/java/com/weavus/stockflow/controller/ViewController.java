package com.weavus.stockflow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

	@GetMapping({
			"/equipments",
			"/rental-detail",
			"/reservation-detail",
			"/rentals",
			"/request-detail-employee",
			"/rental-apply",
			"/mypage",
			"/reservations",
			"/requests",
			"/employee-detail",
			"/rentals-employee",
			"/employees",
			"/favorites",
			"/reservations-employee",
			"/requests-employee",
			"/request-detail",
			"/register-equipment",
			"/profile"
	})
	public String page(org.springframework.web.context.request.WebRequest request) {
		return request.getDescription(false).replace("uri=/", "");
	}
}
