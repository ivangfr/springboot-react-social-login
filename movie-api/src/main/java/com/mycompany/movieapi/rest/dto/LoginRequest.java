package com.mycompany.movieapi.rest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @ApiModelProperty(example = "user")
    @NotBlank
    private String username;

    @ApiModelProperty(position = 1, example = "user")
    @NotBlank
    private String password;

}
