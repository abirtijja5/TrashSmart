package com.trashsmart.trash_smart_api.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TrashBin {
    @Id
    private String id; // ex: "B-001"

    private String location;
    private String type;       // plastique, verre, papier, metal, organique
    private int fillLevel;     // 0-100
    private String status;     // normal, warning, critical
    private double latitude;
    private double longitude;
    private boolean active;
    private LocalDateTime lastUpdate;

    @JsonIgnore
    @OneToMany(mappedBy = "trashBin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Waste> wastes = new ArrayList<>();
}
