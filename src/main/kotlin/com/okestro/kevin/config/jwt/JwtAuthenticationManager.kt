package com.okestro.kevin.config.jwt

import com.okestro.kevin.common.exception.InvalidJwtTokenException
import com.okestro.kevin.user.service.UserService
import kotlinx.coroutines.reactor.mono
import org.springframework.context.annotation.Lazy
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

/**
 * packageName  : com.okestro.dev6.config.jwt
 * fileName     : JwtAuthenticationManager
 * author       : 이재철
 * date         : 2024. 5. 13.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 5. 13.          이재철         최초 생성
 */
@Component
class JwtAuthenticationManager(
    val support: JwtSupport,
    @Lazy val service: UserService,
): ReactiveAuthenticationManager {
    override fun authenticate(authentication: Authentication?): Mono<Authentication> =
        Mono.justOrEmpty(authentication)
            .filter { auth -> auth is BearerToken }
            .cast(BearerToken::class.java)
            .flatMap { jwt -> mono { validate(jwt) } }
            .onErrorMap { error -> InvalidBearerToken(error.message) }

    private suspend fun validate(token: BearerToken): Authentication {
        support.getUserInfo(token.value)?.let { userInfo ->
            val user = service.findByUsername(userInfo.username)
            if (support.isValid(token.value)) {
                return UsernamePasswordAuthenticationToken(user!!.username, user.password, listOf(SimpleGrantedAuthority(user.role.name)))
            }
        }

        throw InvalidJwtTokenException()
    }
}

class InvalidBearerToken(message: String?): AuthenticationException(message)