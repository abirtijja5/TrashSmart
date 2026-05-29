package com.trashsmart.trash_smart_api.user_profile.mappers;


import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.user_profile.dtos.UserTrashSmartDto;
import com.trashsmart.trash_smart_api.user_profile.entities.UserTrashSmart;
import org.springframework.stereotype.Component;


@Component
public class UserTrashSmartMapper {

    public UserTrashSmartDto toDto(UserTrashSmart userTrashSmart) {
        if (userTrashSmart == null) return null;
        return UserTrashSmartDto.builder()
                .id(userTrashSmart.getId())
                .firstName(userTrashSmart.getFirstName())
                .lastName(userTrashSmart.getLastName())
                .phone(userTrashSmart.getPhone())
                .isLocationAccepted(userTrashSmart.isLocationAccepted())
                .pushNotificationsEnabled(userTrashSmart.isPushNotificationsEnabled())
                .rewardPoints(userTrashSmart.getRewardPoints())
                .lastLatitude(userTrashSmart.getLastLatitude())
                .lastLongitude(userTrashSmart.getLastLongitude())
                .appUserId(userTrashSmart.getAppUser() != null ? userTrashSmart.getAppUser().getId() : null)
                .build();
    }

    public UserTrashSmart toEntity(UserTrashSmartDto dto, AppUser appUser) {
        if (dto == null) return null;
        return UserTrashSmart.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .isLocationAccepted(dto.isLocationAccepted())
                .pushNotificationsEnabled(dto.isPushNotificationsEnabled())
                .rewardPoints(dto.getRewardPoints())
                .lastLatitude(dto.getLastLatitude())
                .lastLongitude(dto.getLastLongitude())
                .appUser(appUser)
                .build();
    }

}

