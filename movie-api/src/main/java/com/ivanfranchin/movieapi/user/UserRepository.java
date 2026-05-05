package com.ivanfranchin.movieapi.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ivanfranchin.movieapi.security.Role;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  List<User> findAllByOrderByUsername();

  long countByRole(Role role);
}
