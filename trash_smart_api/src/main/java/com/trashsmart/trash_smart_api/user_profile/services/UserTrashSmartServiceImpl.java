package com.trashsmart.trash_smart_api.user_profile.services;

import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.repositories.AppUserRepository;
import com.trashsmart.trash_smart_api.user_profile.dtos.UserTrashSmartDto;
import com.trashsmart.trash_smart_api.user_profile.entities.UserTrashSmart;
import com.trashsmart.trash_smart_api.user_profile.mappers.UserTrashSmartMapper;
import com.trashsmart.trash_smart_api.user_profile.repositories.UserTrashSmartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserTrashSmartServiceImpl implements UserTrashSmartService {

    private final UserTrashSmartRepository userTrashSmartRepository;
    private final AppUserRepository appUserRepository;
    private final UserTrashSmartMapper userTrashSmartMapper;

    @Override
    public UserTrashSmartDto createProfile(UserTrashSmartDto profileDto) {
        AppUser appUser = appUserRepository.findById(profileDto.getAppUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (userTrashSmartRepository.findByAppUserId(appUser.getId()).isPresent()) {
            throw new RuntimeException("Un profil existe déjà pour cet utilisateur.");
        }

        UserTrashSmart profile = userTrashSmartMapper.toEntity(profileDto, appUser);
        return userTrashSmartMapper.toDto(userTrashSmartRepository.save(profile));
    }

    @Override
    public UserTrashSmartDto getProfileByAppUserId(Long appUserId) {
        UserTrashSmart profile = userTrashSmartRepository.findByAppUserId(appUserId)
                .orElseThrow(() -> new RuntimeException("Profil introuvable pour l'utilisateur ID : " + appUserId));
        return userTrashSmartMapper.toDto(profile);
    }

    @Override
    public UserTrashSmartDto updateProfile(Long appUserId, UserTrashSmartDto profileDto) {
        UserTrashSmart existingProfile = userTrashSmartRepository.findByAppUserId(appUserId)
                .orElseThrow(() -> new RuntimeException("Profil introuvable"));

        existingProfile.setLocationAccepted(profileDto.isLocationAccepted());
        existingProfile.setPushNotificationsEnabled(profileDto.isPushNotificationsEnabled());
        // On ne met pas à jour les points ici pour éviter la triche via une simple requête PUT

        return userTrashSmartMapper.toDto(userTrashSmartRepository.save(existingProfile));
    }

     /* @Override
    public UserTrashSmartDto createProfile(UserTrashSmartDto profileDto) {
        AppUser appUser = null;
        if (profileDto.getAppUserId() != null) {
            // Remplacer "findById" par la méthode exacte de ton AppUserRepository si différente
            appUser = appUserRepository.findById(profileDto.getAppUserId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur de sécurité non trouvé avec l'ID : " + profileDto.getAppUserId()));
        }

        // Vérifier si un profil existe déjà pour cet utilisateur pour éviter les doublons (OneToOne)
        if (appUser != null && userTrashSmartRepository.findByAppUserId(appUser.getId()).isPresent()) {
            throw new RuntimeException("Un profil existe déjà pour cet utilisateur.");
        }

        UserTrashSmart profile = userTrashSmartMapper.toEntity(profileDto, appUser);
        UserTrashSmart savedProfile = userTrashSmartRepository.save(profile);
        return userTrashSmartMapper.toDto(savedProfile);
    }*/

    @Override
    public UserTrashSmartDto addRewardPoints(Long appUserId, int pointsToAdd) {
        UserTrashSmart existingProfile = userTrashSmartRepository.findByAppUserId(appUserId)
                .orElseThrow(() -> new RuntimeException("Profil introuvable"));

        existingProfile.setRewardPoints(existingProfile.getRewardPoints() + pointsToAdd);
        return userTrashSmartMapper.toDto(userTrashSmartRepository.save(existingProfile));
    }

    @Override
    public void deleteProfile(Long appUserId) {
        UserTrashSmart existingProfile = userTrashSmartRepository.findByAppUserId(appUserId)
                .orElseThrow(() -> new RuntimeException("Profil introuvable"));
        userTrashSmartRepository.delete(existingProfile);
    }




  /*  @Override
    public UserTrashSmartService seConnecter() {
        return null;
    }*/

   /* @Override
    public UserTrashSmartService sincrire() {
        return null;
    }*/

   /* @Override
    public void consulterPoubellesProches() {

    }*/
   /* @Override
    public void voirEtatPoubelle() {

    }*/
   /* @Override
    public void signalerProbleme() {

    }*/
   /* @Override
    public void visualiserStatistique() {

    }*/
}
