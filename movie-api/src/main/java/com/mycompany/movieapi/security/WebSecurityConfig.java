package com.mycompany.movieapi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final TokenAuthenticationFilter tokenAuthenticationFilter;

    public WebSecurityConfig(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder, TokenAuthenticationFilter tokenAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.tokenAuthenticationFilter = tokenAuthenticationFilter;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/movies", "/api/movies/**").hasAnyAuthority(ADMIN, USER)
                .antMatchers(HttpMethod.GET, "/api/users/me").hasAnyAuthority(ADMIN, USER)
                .antMatchers("/api/movies", "/api/movies/**").hasAnyAuthority(ADMIN)
                .antMatchers("/api/users", "/api/users/**").hasAnyAuthority(ADMIN)
                .antMatchers("/public/**", "/auth/**", "/oauth2/**").permitAll()
                .antMatchers("/", "/error", "/favicon.ico", "/csrf", "/swagger-ui.html", "/v2/api-docs", "/webjars/**", "/swagger-resources/**").permitAll()
                .anyRequest().authenticated();
        http.oauth2Login()
                .authorizationEndpoint().baseUri("/oauth2/authorization").authorizationRequestRepository(new HttpSessionOAuth2AuthorizationRequestRepository())
                .and()
//                .redirectionEndpoint().baseUri("/oauth2/callback/*")
//                .and()
//                .userInfoEndpoint().userService(customOAuth2UserService)
//                .and()
                .successHandler(new SimpleUrlAuthenticationSuccessHandler())
                .failureHandler(new SimpleUrlAuthenticationFailureHandler());
        http.logout(l -> l.logoutSuccessUrl("/").permitAll());
        http.addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
//        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.csrf().disable();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";
}
