package com.trashsmart.trash_smart_api.mappers;

import com.trashsmart.trash_smart_api.dtos.TrashBinDTO;
import com.trashsmart.trash_smart_api.entities.TrashBin;
import org.springframework.stereotype.Component;

@Component
public class TrashBinMapper {
    public TrashBinDTO toDTO(TrashBin b) {
        return TrashBinDTO.builder()
            .id(b.getId()).location(b.getLocation()).type(b.getType())
            .fillLevel(b.getFillLevel()).status(b.getStatus())
            .latitude(b.getLatitude()).longitude(b.getLongitude())
            .active(b.isActive()).lastUpdate(b.getLastUpdate())
            .build();
    }
    public TrashBin fromDTO(TrashBinDTO d) {
        TrashBin b = new TrashBin();
        b.setId(d.getId()); b.setLocation(d.getLocation()); b.setType(d.getType());
        b.setFillLevel(d.getFillLevel()); b.setStatus(d.getStatus());
        b.setLatitude(d.getLatitude()); b.setLongitude(d.getLongitude());
        b.setActive(d.isActive());
        return b;
    }
}
