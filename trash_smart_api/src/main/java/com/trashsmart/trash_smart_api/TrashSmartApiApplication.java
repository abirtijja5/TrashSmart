package com.trashsmart.trash_smart_api;

import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;

import com.trashsmart.trash_smart_api.security.services.AccountAuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;


@SpringBootApplication
public class TrashSmartApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrashSmartApiApplication.class, args);
    }

    /* @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }*/

    @Bean
    CommandLineRunner commandLineRunner( AccountAuthService accountAuthService) {
        return args -> {
            System.out.println("TrashSmart API launched successfully!");
            // Création des roles
            accountAuthService.addRole(new AppRole(null, "USER"));
            accountAuthService.addRole(new AppRole(null, "ADMIN"));
            accountAuthService.addRole(new AppRole(null, "TRASH-SMART_MANAGER"));
            accountAuthService.addRole(new AppRole(null, "TRASHCAN_MANAGER"));
            accountAuthService.addRole(new AppRole(null, "WASTE_MANAGER"));
            // Création des utilisateurs
            accountAuthService.addUser(new AppUser(null, "user1", "1230","user1@gmail.com",true, new ArrayList<>()));
            accountAuthService.addUser(new AppUser(null, "admin", "1230","admin@gmail.com", true, new ArrayList<>()));
            accountAuthService.addUser(new AppUser(null, "user2", "1230","user2@gmail.com", true,new ArrayList<>()));
            accountAuthService.addUser(new AppUser(null, "user3", "1230","user3@gmail.com", true,new ArrayList<>()));
            accountAuthService.addUser(new AppUser(null, "user4", "1230","user4@gmail.com", true,new ArrayList<>()));

            // Ajout de role à un utilisateur
            accountAuthService.addRoleToUser("user1", "USER");
            accountAuthService.addRoleToUser("admin", "USER");
            accountAuthService.addRoleToUser("admin", "ADMIN");
            accountAuthService.addRoleToUser("user2", "USER");
            accountAuthService.addRoleToUser("user2", "TRASH-SMART_MANAGER");
            accountAuthService.addRoleToUser("user3", "USER");
            accountAuthService.addRoleToUser("user3", "TRASHCAN_MANAGER");
            accountAuthService.addRoleToUser("user4", "USER");
            accountAuthService.addRoleToUser("user4", "WASTE_MANAGER");

           /* Stream.of("User1", "User2","User3").forEach(user -> {
                appUserRepository.save(new AppUser(null, "John","Doe","JohnD@gmail.com","1230", true ));
            });
            appUserRepository.findAll().forEach(user -> {
                System.out.println(user.getFirstName());
            });*/
        };
    }

}
