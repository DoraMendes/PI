package net.estg.ei.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Arrays;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
		return args -> {
			System.out.println("Application started");
			System.out.println("  _____           _      _          _____        __                       __  _   _           \n"
							+ " |  __ \\         (_)    | |        |_   _|      / _|                     /_/ | | (_)          \n"
							+ " | |__) | __ ___  _  ___| |_ ___     | |  _ __ | |_ ___  _ __ _ __ ___   __ _| |_ _  ___ ___  \n"
							+ " |  ___/ '__/ _ \\| |/ _ \\ __/ _ \\    | | | '_ \\|  _/ _ \\| '__| '_ ` _ \\ / _` | __| |/ __/ _ \\ \n"
							+ " | |   | | | (_) | |  __/ || (_) |  _| |_| | | | || (_) | |  | | | | | | (_| | |_| | (_| (_) |\n"
							+ " |_|   |_|  \\___/| |\\___|\\__\\___/  |_____|_| |_|_| \\___/|_|  |_| |_| |_|\\__,_|\\__|_|\\___\\___/ \n"
							+ "                _/ |                                                                          \n"
							+ "               |__/                                                                           ");
		};
	}
}
