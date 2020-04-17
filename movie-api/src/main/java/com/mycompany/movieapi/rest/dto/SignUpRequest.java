package com.mycompany.movieapi.rest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class SignUpRequest {

    @ApiModelProperty(example = "user3")
    @NotBlank
    private String username;

    @ApiModelProperty(position = 1, example = "user3")
    @NotBlank
    private String password;

    @ApiModelProperty(position = 2, example = "User3")
    @NotBlank
    private String name;

    @ApiModelProperty(position = 3, example = "user3@mycompany.com")
    @Email
    private String email;

}
