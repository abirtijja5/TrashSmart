/*package com.trashsmart.trash_smart_api.initialization;

import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.services.AccountService;
import jakarta.annotation.PostConstruct;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Data
@NoArgsConstructor
@Builder*/
/*public class DataInitializer {

    private  AccountService accountService;

    public DataInitializer(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostConstruct
    public void initData() {
        // Ajouter les rôles s'ils n'existent pas
        accountService.addRole(new AppRole(null, "ROLE_USER"));
        accountService.addRole(new AppRole(null, "ROLE_ADMIN"));

        // Ajouter l'utilisateur admin
        AppUser admin = AppUser.builder()
                .username("admin")
                .password("1234") // sera encodé dans le service
                .enabled(true)
                .roles(Set.of()) // on ajoutera les rôles ensuite
                .build();

        accountService.addUser(admin);
        accountService.addRoleToUser("admin", "ROLE_ADMIN");

        System.out.println(" Données initiales insérées.");
    }
}
*/
