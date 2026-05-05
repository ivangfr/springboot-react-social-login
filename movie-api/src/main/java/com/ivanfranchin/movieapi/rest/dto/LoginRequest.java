package com.ivanfranchin.movieapi.rest.dto;

import jakarta.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginRequest(
    @Schema(example = "user") @NotBlank String username,
    @Schema(example = "user") @NotBlank String password) {}
