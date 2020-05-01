package com.mycompany.movieapi.rest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateMovieRequest {

    @ApiModelProperty(example = "ghi")
    @NotBlank
    private String imdb;

    @ApiModelProperty(position = 1, example = "American Pie")
    @NotBlank
    private String title;

}
