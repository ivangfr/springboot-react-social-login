package com.mycompany.movieapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatedUserInfoException extends RuntimeException {

    public DuplicatedUserInfoException(String message) {
        super(message);
    }
}
