package com.trashsmart.trash_smart_api.security.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String username;  // fallback
    private String password;
}
