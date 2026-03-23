package com.ivanfranchin.movieapi.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserDeletionNotAllowedException extends RuntimeException {

    public UserDeletionNotAllowedException(String message) {
        super(message);
    }
}
