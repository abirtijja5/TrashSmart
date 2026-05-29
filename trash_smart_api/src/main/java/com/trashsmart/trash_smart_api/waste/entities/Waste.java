package com.trashsmart.trash_smart_api.waste.entities;

import com.trashsmart.trash_smart_api.core.enums.WasteType;
import com.trashsmart.trash_smart_api.trashcan.entities.Trashcan;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder

public class Waste {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private WasteType wasteType;
    private double weight;

    private double volume;
    private LocalDateTime depositDate;

    @ManyToOne
    @JoinColumn(name = "trashcan_id")
    private Trashcan trashcan;
}
/*public class Waste {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private double weight;

    private LocalDateTime depositedAt;

    @Enumerated(EnumType.STRING)
    private WasteType type;

    @ManyToOne
    @JoinColumn(name = "trashBin")
    private Trashcan trashBin;

    @ManyToOne
    @JoinColumn(name = "userTrashSmart")
    private UserTrashSmart userTrashSmart;
}*/

