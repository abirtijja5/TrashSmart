package com.trashsmart.trash_smart_api.repositories;


import com.trashsmart.trash_smart_api.entities.UserTrashSmart;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserTrashSmartRepository extends JpaRepository<UserTrashSmart, Long> {
   // UserTrashSmart findByEmail(String email);
}

