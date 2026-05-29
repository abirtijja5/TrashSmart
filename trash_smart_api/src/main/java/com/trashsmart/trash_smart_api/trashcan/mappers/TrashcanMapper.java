package com.trashsmart.trash_smart_api.trashcan.mappers;

import com.trashsmart.trash_smart_api.trashcan.dtos.TrashcanDto;
import com.trashsmart.trash_smart_api.trashcan.entities.Trashcan;
import org.springframework.stereotype.Component;

@Component
public class TrashcanMapper {

    public TrashcanDto toDto(Trashcan trashcan) {
        if (trashcan == null) {
            return null;
        }
        return TrashcanDto.builder()
                .id(trashcan.getId())
                .reference(trashcan.getReference())
                .latitude(trashcan.getLatitude())
                .longitude(trashcan.getLongitude())
                .isFull(trashcan.isFull())
                .isBlocked(trashcan.isBlocked())
                .build();
    }

    public Trashcan toEntity(TrashcanDto dto) {
        if (dto == null) {
            return null;
        }
        return Trashcan.builder()
                .id(dto.getId())
                .reference(dto.getReference())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .isFull(dto.isFull())
                .isBlocked(dto.isBlocked())
                .build();
    }
}
