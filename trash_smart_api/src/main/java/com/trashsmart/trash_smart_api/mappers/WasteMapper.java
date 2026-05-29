package com.trashsmart.trash_smart_api.mappers;

import com.trashsmart.trash_smart_api.dtos.WasteDTO;
import com.trashsmart.trash_smart_api.entities.Waste;
import org.springframework.stereotype.Component;

@Component
public class WasteMapper {
    public WasteDTO toDTO(Waste w) {
        return WasteDTO.builder()
            .id(w.getId()).binId(w.getBinId()).wasteType(w.getWasteType())
            .weightKg(w.getWeightKg()).collectedBy(w.getCollectedBy())
            .notes(w.getNotes()).collectedAt(w.getCollectedAt())
            .build();
    }
    public Waste fromDTO(WasteDTO d) {
        Waste w = new Waste();
        w.setId(d.getId()); w.setBinId(d.getBinId()); w.setWasteType(d.getWasteType());
        w.setWeightKg(d.getWeightKg()); w.setCollectedBy(d.getCollectedBy());
        w.setNotes(d.getNotes()); w.setCollectedAt(d.getCollectedAt());
        return w;
    }
}
