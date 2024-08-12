package com.okestro.kevin.config.jwt

import org.springframework.http.HttpHeaders
import org.springframework.security.core.Authentication
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * packageName  : com.okestro.dev6.config.jwt
 * fileName     : JwtAuthConverter
 * author       : 이재철
 * date         : 2024. 5. 13.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 5. 13.          이재철         최초 생성
 */
@Component
class JwtAuthConverter: ServerAuthenticationConverter {
    override fun convert(exchange: ServerWebExchange?): Mono<Authentication> =
        Mono.justOrEmpty(exchange?.request?.headers?.getFirst(HttpHeaders.AUTHORIZATION))
            .filter { it.startsWith("Bearer ") }.map { it.substring(7) }.map {
                jwt -> BearerToken(jwt)
            }
}