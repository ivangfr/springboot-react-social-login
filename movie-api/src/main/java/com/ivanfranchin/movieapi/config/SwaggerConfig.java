package com.ivanfranchin.movieapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

  public static final String BEARER_KEY_SECURITY_SCHEME = "bearer-key";

  @Bean
  OpenAPI customOpenAPI(@Value("${spring.application.name}") String applicationName) {
    return new OpenAPI()
        .components(
            new Components()
                .addSecuritySchemes(
                    BEARER_KEY_SECURITY_SCHEME,
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
        .info(new Info().title(applicationName));
  }
}
