package com.trashsmart.trash_smart_api.user_profile.dtos;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserTrashSmartDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private boolean isLocationAccepted;
    private boolean pushNotificationsEnabled;
    private int rewardPoints;
    private Double lastLatitude;
    private Double lastLongitude;

    // On ne renvoie que l'ID technique de l'utilisateur, pas tout l'objet AppUser
    private Long appUserId;

}

