package com.trashsmart.trash_smart_api.security.web;

import com.trashsmart.trash_smart_api.security.dtos.JwtResponse;
import com.trashsmart.trash_smart_api.security.dtos.LoginRequest;
import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.filters.JwtUtil;
import com.trashsmart.trash_smart_api.security.services.AccountAuthService;
import com.trashsmart.trash_smart_api.security.utils.RoleUserForm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AccountAuthController {
    private final AccountAuthService accountAuthService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // Cherche par email OU par username
        AppUser user = accountAuthService.getUserByEmail(req.getEmail());
        if (user == null && req.getUsername() != null)
            user = accountAuthService.getUserByUsername(req.getUsername());
        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Email ou mot de passe incorrect"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Email ou mot de passe incorrect"));

        List<GrantedAuthority> authorities = user.getRoles().stream()
            .map(r -> (GrantedAuthority) new SimpleGrantedAuthority(r.getRoleName())).toList();
        String token = jwtUtil.generateToken(user.getUsername(), authorities);
        return ResponseEntity.ok(new JwtResponse(token, token));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {}

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = accountAuthService.getUserByUsername(username);
        if (user == null) return ResponseEntity.status(404).body(Map.of("message","Not found"));
        String role = user.getRoles().stream().findFirst().map(r -> r.getRoleName().toLowerCase().replace("role_","")).orElse("viewer");
        return ResponseEntity.ok(Map.of(
            "id",    user.getId(),
            "email", user.getEmail() != null ? user.getEmail() : user.getUsername(),
            "name",  user.getUsername(),
            "role",  role
        ));
    }

    @GetMapping("/users")
    public List<AppUser> getAll() { return accountAuthService.appUsersList(); }

    @PostMapping("/register")
    public AppUser register(@RequestBody AppUser u) { return accountAuthService.addUser(u); }

    @GetMapping("/user/{username}")
    public AppUser getByUsername(@PathVariable String username) { return accountAuthService.getUserByUsername(username); }

    @PostMapping("/roles")
    public AppRole saveRole(@RequestBody AppRole role) { return accountAuthService.addRole(role); }

    @PostMapping("/addRoleToUser")
    public void addRoleToUser(@RequestBody RoleUserForm form) { accountAuthService.addRoleToUser(form.getUsername(), form.getRoleName()); }
}
