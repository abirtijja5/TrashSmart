package com.trashsmart.trash_smart_api.security.services;

import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.repository.AppUserRepository;
import lombok.AllArgsConstructor;
//import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//import java.util.ArrayList;
//import java.util.Collection;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {


    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepository.findByUsername(username);

        return new org.springframework.security.core.userdetails.User(
                appUser.getUsername(),
                appUser.getPassword(),
                appUser.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                        .toList()
        );
    }

     /* private final AccountAuthService accountAuthService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = accountAuthService.getUserByUsername(username);
        if (appUser == null) throw new UsernameNotFoundException(String.format("AppUser %s not Found",username));
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        appUser.getRoles().forEach(appRole -> authorities.add(new SimpleGrantedAuthority(appRole.getRoleName())));
        return new User(appUser.getUsername(), appUser.getPassword(), authorities);
    }*/


}

