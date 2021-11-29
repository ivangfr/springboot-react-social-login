package com.mycompany.movieapi.mapper;

import com.mycompany.movieapi.model.User;
import com.mycompany.movieapi.rest.dto.UserDto;

import org.mapstruct.Mapper;
import org.springframework.context.annotation.Configuration;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Configuration
@Mapper(
  componentModel = "spring",
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {

  UserDto toUserDto(User user);
}