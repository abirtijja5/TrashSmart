package com.trashsmart.trash_smart_api.waste.repositories;

import com.trashsmart.trash_smart_api.waste.entities.Waste;
import org.springframework.data.jpa.repository.JpaRepository;


public interface WasteRepository extends JpaRepository<Waste, Long> {

}

