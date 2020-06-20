package com.mycompany.movieapi.rest.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SignUpRequest {

    @Schema(example = "user3")
    @NotBlank
    private String username;

    @Schema(example = "user3")
    @NotBlank
    private String password;

    @Schema(example = "User3")
    @NotBlank
    private String name;

    @Schema(example = "user3@mycompany.com")
    @Email
    private String email;

}
