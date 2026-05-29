package com.trashsmart.trash_smart_api.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TrashBinDTO {
    private String id;
    private String location;
    private String type;
    private int fillLevel;
    private String status;
    private double latitude;
    private double longitude;
    private boolean active;
    private LocalDateTime lastUpdate;
}
