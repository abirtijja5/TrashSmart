package com.trashsmart.trash_smart_api.repositories;

import com.trashsmart.trash_smart_api.entities.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByAcknowledgedAtIsNull();
    long countByAcknowledgedAtIsNull();
}
