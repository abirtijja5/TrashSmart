package com.trashsmart.trash_smart_api.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WasteDTO {
    private String id;
    private String binId;
    private String wasteType;
    private double weightKg;
    private String collectedBy;
    private String notes;
    private LocalDateTime collectedAt;
}
