package com.mycompany.movieapi.mapper;

import com.mycompany.movieapi.model.Movie;
import com.mycompany.movieapi.rest.dto.CreateMovieRequest;
import com.mycompany.movieapi.rest.dto.MovieDto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.context.annotation.Configuration;

@Configuration
@Mapper(
  componentModel = "spring",
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface MovieMapper {

  Movie toMovie(CreateMovieRequest createMovieRequest);

  @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
  MovieDto toMovieDto(Movie movie);

}