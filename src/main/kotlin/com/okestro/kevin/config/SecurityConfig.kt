package com.okestro.kevin.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.okestro.kevin.common.exception.ErrorResponse
import com.okestro.kevin.config.jwt.JwtAuthConverter
import com.okestro.kevin.config.jwt.JwtAuthenticationManager
import com.okestro.kevin.user.domain.model.Role
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService
import org.springframework.security.core.userdetails.User
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import reactor.core.publisher.Mono

/**
 * packageName  : com.okestro.dev6.config
 * fileName     : SecurityConfig
 * author       : 이재철
 * date         : 2024. 5. 13.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 5. 13.          이재철         최초 생성
 */
@Configuration
@EnableWebFluxSecurity
class SecurityConfig(
    val authManager: JwtAuthenticationManager,
    val converter: JwtAuthConverter,
    @Value("\${app.front-url}") private val frontUrl: String,
) {
    @Bean
    fun securityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain =
        http
            .csrf { it.disable() }
            .httpBasic { it.disable() }
            .formLogin { it.disable() }
            .logout { it.disable() }
            .authorizeExchange {
                it.pathMatchers("/api/signup", "/api/login", "/cmt").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/renew-token").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
                    .pathMatchers(HttpMethod.OPTIONS).permitAll()
                    .anyExchange().authenticated()
            }
            .exceptionHandling {
                it.authenticationEntryPoint { exchange, ex ->
                    exchange.response.statusCode = HttpStatus.UNAUTHORIZED
                    val response = exchange.response
                    val buffer: DataBuffer = response.bufferFactory().wrap(
                        ObjectMapper().writeValueAsString(
                            ErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.message.toString())
                        ).toByteArray(Charsets.UTF_8)
                    )
                    exchange.response.writeWith(Mono.just(buffer))
                }
                    .accessDeniedHandler { exchange, ex ->
                        exchange.response.statusCode = HttpStatus.FORBIDDEN
                        val response = exchange.response
                        val buffer: DataBuffer = response.bufferFactory().wrap(
                            ObjectMapper().writeValueAsString(
                                ErrorResponse(HttpStatus.FORBIDDEN.value(), ex.message.toString())
                            ).toByteArray(Charsets.UTF_8)
                        )
                        exchange.response.writeWith(Mono.just(buffer))
                    }
            }
            .addFilterBefore(AuthenticationWebFilter(authManager).apply {
                setServerAuthenticationConverter(converter)
            }, SecurityWebFiltersOrder.AUTHENTICATION)
            .build()

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource =
        UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", CorsConfiguration().applyPermitDefaultValues().apply {
                allowedOriginPatterns = listOf(frontUrl)
                allowedMethods = listOf("*")
                allowCredentials = false
            })
        }

    @Bean
    fun userDetailsService() =
        MapReactiveUserDetailsService(
            User.builder()
                .username("kevin")
                .password("okestro")
                .roles(Role.ADMIN.name, Role.USER.name)
                .build()
        )
}