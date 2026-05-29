package com.trashsmart.trash_smart_api.security.services;

import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;
import java.util.List;

public interface AccountAuthService {
    AppUser addUser(AppUser user);
    AppUser getUserByUsername(String username);
    AppUser getUserByEmail(String email);
    List<AppUser> appUsersList();
    AppRole addRole(AppRole role);
    void addRoleToUser(String username, String roleName);
}
