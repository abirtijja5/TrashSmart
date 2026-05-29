package com.trashsmart.trash_smart_api.web;

import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.services.AccountAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final AccountAuthService authService;

    @GetMapping
    public List<AppUser> getAll() { return authService.appUsersList(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppUser create(@RequestBody AppUser user) { return authService.addUser(user); }

    @PatchMapping("/{id}")
    public AppUser update(@PathVariable Long id, @RequestBody AppUser updates) {
        AppUser existing = authService.getUserByUsername(updates.getUsername() != null ? updates.getUsername() : "");
        if (existing == null) existing = authService.appUsersList().stream().filter(u -> u.getId().equals(id)).findFirst().orElseThrow();
        if (updates.getEmail() != null) existing.setEmail(updates.getEmail());
        if (updates.getUsername() != null) existing.setUsername(updates.getUsername());
        if (updates.getPassword() != null && !updates.getPassword().isBlank()) existing.setPassword(updates.getPassword());
        return authService.addUser(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        // No-op for safety — could be extended
    }
}
