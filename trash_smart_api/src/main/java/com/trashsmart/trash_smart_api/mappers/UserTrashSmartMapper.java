package com.trashsmart.trash_smart_api.mappers;


import com.trashsmart.trash_smart_api.dtos.UserTrashSmartDTO;
import com.trashsmart.trash_smart_api.entities.UserTrashSmart;
import org.springframework.stereotype.Component;


@Component
public class UserTrashSmartMapper {

    public UserTrashSmartDTO toDTO(UserTrashSmart userTrashSmart) {
        return UserTrashSmartDTO.builder()
                .id(userTrashSmart.getId())
                .firstName(userTrashSmart.getFirstName())
                .lastName(userTrashSmart.getLastName())
                .username(userTrashSmart.getUsername())
                .email(userTrashSmart.getEmail())
                .password(userTrashSmart.getPassword())
                .phone(userTrashSmart.getPhone())
                .active(userTrashSmart.isActive())
                .build();
    }

    public UserTrashSmart fromDTO(UserTrashSmartDTO dto) {
        return UserTrashSmart.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phone(dto.getPhone())
                .active(dto.isActive())
                .build();
    }
}

