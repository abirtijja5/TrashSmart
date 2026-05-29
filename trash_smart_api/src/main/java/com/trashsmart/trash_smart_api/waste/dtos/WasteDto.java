package com.trashsmart.trash_smart_api.waste.dtos;

import com.trashsmart.trash_smart_api.core.enums.WasteType;
import lombok.*;

import java.time.LocalDateTime;


@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WasteDto {
    private Long id;
    private WasteType wasteType;
    private double weight;
    private double volume;
    private LocalDateTime depositDate;
    private Long trashcanId;
}


