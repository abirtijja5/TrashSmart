package com.trashsmart.trash_smart_api.security.services;

import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;

import java.util.List;

//import java.util.List;

public interface AccountAuthService {
    AppUser addUser(AppUser appUser);

    AppRole addRole(AppRole appRole);
    void addRoleToUser(String username, String roleName);
   // void removeRoleToUser(String username, String roleName);
    AppUser getUserByUsername(String username);
    List<AppUser> appUsersList();
    void deleteUserById(Long id);
}

