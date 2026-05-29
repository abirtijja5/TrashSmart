package com.trashsmart.trash_smart_api.security.services;

import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.repositories.AppRoleRepository;
import com.trashsmart.trash_smart_api.security.repositories.AppUserRepository;
import com.trashsmart.trash_smart_api.user_profile.repositories.UserTrashSmartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//import java.util.List;


@Service
@Transactional
@RequiredArgsConstructor
public class AccountAuthServiceImpl implements AccountAuthService {

    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserTrashSmartRepository userTrashSmartRepository;



    // Ajout d'un utilisateur avec mot de passe codé
    @Override
    public AppUser addUser(AppUser appUser) {
        // Hachage du mot de passe avant la sauvegarde
        String hashedPassword = passwordEncoder.encode(appUser.getPassword());
        appUser.setPassword(hashedPassword);
        return appUserRepository.save(appUser);
    }
    @Override
    public AppRole addRole(AppRole appRole) {
        return appRoleRepository.save(appRole);
    }
    @Override
    public void addRoleToUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        appUser.getRoles().add(appRole);
        appUserRepository.save(appUser);
    }

    @Override
    public AppUser getUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public List<AppUser> appUsersList() {
        return appUserRepository.findAll();
    }

    @Override
    public void deleteUserById(Long id) {
        AppUser appUser = appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));

        // 1. Supprimer le profil métier associé pour éviter l'erreur de clé étrangère
        userTrashSmartRepository.findByAppUserId(id)
                .ifPresent(userTrashSmartRepository::delete);

        // 2. Détacher les rôles proprement pour nettoyer la table de jointure
        appUser.getRoles().clear();

        // 3. Supprimer l'utilisateur technique
        appUserRepository.delete(appUser);
    }

     /*@Override
    public void removeRoleToUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        appUser.getRoles().remove(appRole);
        appUserRepository.save(appUser);
    }*/
}
