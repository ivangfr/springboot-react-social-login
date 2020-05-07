package com.mycompany.movieapi.rest.dto;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CreateMovieRequest {

    @ApiModelProperty(example = "tt0117998")
    @NotBlank
    private String imdb;

    @ApiModelProperty(position = 1, example = "Twister")
    @NotBlank
    private String title;

    @ApiModelProperty(position = 2, example = "https://m.media-amazon.com/images/M/MV5BODExYTM0MzEtZGY2Yy00N2ExLTkwZjItNGYzYTRmMWZlOGEzXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg")
    private String poster;

}
