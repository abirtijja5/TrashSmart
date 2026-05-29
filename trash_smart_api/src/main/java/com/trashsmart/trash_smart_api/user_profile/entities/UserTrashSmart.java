package com.trashsmart.trash_smart_api.user_profile.entities;

import com.trashsmart.trash_smart_api.security.entities.AppUser;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserTrashSmart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Informations personnelles
    private String firstName;
    private String lastName;
    private String phone;

    // Validation de la localisation pour indiquer les poubelles les plus proches
    // Préférences métier
    private boolean isLocationAccepted;
    private boolean pushNotificationsEnabled;

    @Builder.Default
    private int rewardPoints = 0;

    // Dernière localisation connue
    private Double lastLatitude;
    private Double lastLongitude;

    // La relation vers le module de sécurité
    @OneToOne
    @JoinColumn(name = "app_user_id", referencedColumnName = "id")
    private AppUser appUser;

    /*
    @OneToMany(mappedBy = "userTrashSmart", cascade = CascadeType.ALL)
    private List<Waste> wastes= new ArrayList<>();*/
}

