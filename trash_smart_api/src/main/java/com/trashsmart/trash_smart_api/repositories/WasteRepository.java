package com.trashsmart.trash_smart_api.repositories;

import com.trashsmart.trash_smart_api.entities.Waste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface WasteRepository extends JpaRepository<Waste, String> {
    List<Waste> findByCollectedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT w.wasteType, SUM(w.weightKg) FROM Waste w GROUP BY w.wasteType")
    List<Object[]> sumByType();

    @Query("SELECT COALESCE(SUM(w.weightKg),0) FROM Waste w")
    double totalWeight();
}
