package com.trashsmart.trash_smart_api.trashcan.entities;



import com.trashsmart.trash_smart_api.waste.entities.Waste;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Trashcan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reference;
    private double latitude;
    private double longitude;
    private boolean isFull;
    private boolean isBlocked;

    @OneToMany(mappedBy = "trashcan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // Indispensable pour que Lombok initialise bien la liste avec le Builder
    private List<Waste> wastes = new ArrayList<>();


}

