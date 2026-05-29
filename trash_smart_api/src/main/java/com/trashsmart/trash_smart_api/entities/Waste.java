package com.trashsmart.trash_smart_api.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Waste {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String binId;
    private String wasteType;   // plastique, verre, papier, metal, organique
    private double weightKg;
    private String collectedBy;
    private String notes;
    private LocalDateTime collectedAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trash_bin_id")
    private TrashBin trashBin;
}
