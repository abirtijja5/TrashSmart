package com.trashsmart.trash_smart_api.security.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}

