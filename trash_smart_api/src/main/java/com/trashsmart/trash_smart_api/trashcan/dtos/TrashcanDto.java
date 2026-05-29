package com.trashsmart.trash_smart_api.trashcan.dtos;


import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TrashcanDto {
    private Long id;
    private String reference;
    private double latitude;
    private double longitude;
    private boolean isFull;
    private boolean isBlocked;
}

