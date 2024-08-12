package com.okestro.kevin.config.jwt

import com.okestro.kevin.common.annotation.AuthToken
import com.okestro.kevin.common.exception.InvalidJwtTokenException
import com.okestro.kevin.common.exception.UnAuthorizedException
import com.okestro.kevin.user.service.UserService
import kotlinx.coroutines.runBlocking
import org.springframework.core.MethodParameter
import org.springframework.http.HttpHeaders
import org.springframework.stereotype.Component
import org.springframework.web.reactive.BindingContext
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono

/**
 * packageName  : com.okestro.dev6.config.jwt
 * fileName     : JwtArgumentResolver
 * author       : 이재철
 * date         : 2024. 5. 26.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 5. 26.          이재철         최초 생성
 */
@Component
class JwtArgumentResolver(
    val support: JwtSupport,
    val userService: UserService
) : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter) =
        parameter.hasParameterAnnotation(AuthToken::class.java)

    override fun resolveArgument(
        parameter: MethodParameter,
        bindingContext: BindingContext,
        exchange: ServerWebExchange
    ): Mono<Any> =
        exchange.request.headers[HttpHeaders.AUTHORIZATION]?.first()?.let { header ->
            val token = header.split(" ")
            if (token.size != 2) {
                throw InvalidJwtTokenException()
            }
            val simpleUser = support.getUserInfo(token[1])
            runBlocking {
                userService.getUser(simpleUser!!.id)
            }.toMono()
        } ?: Mono.error(UnAuthorizedException())
}