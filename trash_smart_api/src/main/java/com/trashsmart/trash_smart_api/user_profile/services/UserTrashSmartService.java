package com.trashsmart.trash_smart_api.user_profile.services;


import com.trashsmart.trash_smart_api.user_profile.dtos.UserTrashSmartDto;

public interface UserTrashSmartService  {

    UserTrashSmartDto createProfile(UserTrashSmartDto profileDto);
    UserTrashSmartDto getProfileByAppUserId(Long appUserId);

    UserTrashSmartDto updateProfile(Long appUserId, UserTrashSmartDto profileDto);
    UserTrashSmartDto addRewardPoints(Long appUserId, int pointsToAdd);
    void deleteProfile(Long appUserId);



}