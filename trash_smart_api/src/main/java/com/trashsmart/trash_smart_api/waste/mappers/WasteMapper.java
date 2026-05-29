package com.trashsmart.trash_smart_api.waste.mappers;



import com.trashsmart.trash_smart_api.trashcan.entities.Trashcan;
import com.trashsmart.trash_smart_api.waste.dtos.WasteDto;
import com.trashsmart.trash_smart_api.waste.entities.Waste;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class WasteMapper {

    public WasteDto toDto(Waste waste) {
        if (waste == null) return null;
        return WasteDto.builder()
                .id(waste.getId())
                .wasteType(waste.getWasteType())
                .weight(waste.getWeight())
                .volume(waste.getVolume())
                .depositDate(waste.getDepositDate())
                .trashcanId(waste.getTrashcan() != null ? waste.getTrashcan().getId() : null)
                .build();
    }

    public Waste toEntity(WasteDto dto, Trashcan trashcan) {
        if (dto == null) return null;
        return Waste.builder()
                .id(dto.getId())
                .wasteType(dto.getWasteType())
                .weight(dto.getWeight())
                .volume(dto.getVolume())
                .depositDate(dto.getDepositDate() != null ? dto.getDepositDate() : LocalDateTime.now())
                .trashcan(trashcan)
                .build();
    }
}

/*public class WasteMapper {

    private final TrashcanRepository trashBinRepository;

    public WasteDTO toDTO(Waste waste) {
        return WasteDTO.builder()
                .id(waste.getId())
                .weight(waste.getWeight())
                .depositedAt(waste.getDepositedAt())
                .type(waste.getType())
               .trashBinId(waste.getTrashBin().getId())
                .build();
    }

    public Waste fromDTO(WasteDTO dto) {
       Trashcan bin = trashBinRepository.findById(dto.getTrashBinId())
               .orElseThrow(() -> new RuntimeException("Trash bin not found"));
        return Waste.builder()
                .id(dto.getId())
                .description(dto.getDescription())
                .weight(dto.getWeight())
                .depositedAt(dto.getDepositedAt())
                .type(dto.getType())
                .build();
    }
}*/

