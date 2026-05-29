package com.trashsmart.trash_smart_api.user_profile.repositories;


import com.trashsmart.trash_smart_api.user_profile.entities.UserTrashSmart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserTrashSmartRepository extends JpaRepository<UserTrashSmart, Long> {
    Optional<UserTrashSmart> findByAppUserId(Long appUserId);
}

