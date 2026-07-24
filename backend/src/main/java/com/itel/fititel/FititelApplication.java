package com.itel.fititel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class FititelApplication {

	public static void main(String[] args) {
		SpringApplication.run(FititelApplication.class, args);
	}

}
