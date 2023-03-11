package com.ivanfranchin.movieapi.mapper;

import com.ivanfranchin.movieapi.model.User;
import com.ivanfranchin.movieapi.rest.dto.UserDto;

public interface UserMapper {

    UserDto toUserDto(User user);
}