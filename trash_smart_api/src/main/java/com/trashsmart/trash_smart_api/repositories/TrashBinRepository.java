package com.trashsmart.trash_smart_api.repositories;

import com.trashsmart.trash_smart_api.entities.TrashBin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrashBinRepository extends JpaRepository<TrashBin, String> {
}
