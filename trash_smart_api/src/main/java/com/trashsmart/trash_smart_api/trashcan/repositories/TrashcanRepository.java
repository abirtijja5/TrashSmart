package com.trashsmart.trash_smart_api.trashcan.repositories;

import com.trashsmart.trash_smart_api.trashcan.entities.Trashcan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrashcanRepository extends JpaRepository<Trashcan, Long> {
}
