package com.trashsmart.trash_smart_api.security.repository;

import com.trashsmart.trash_smart_api.security.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

//import java.util.Optional;

public interface AppRoleRepository extends JpaRepository<AppRole, Long> {
   // Optional<AppRole> findByRoleName(String roleName);
    AppRole findByRoleName(String roleName);
}
