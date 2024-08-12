package com.okestro.kevin.user.api

import com.okestro.kevin.common.exception.BadParameterException
import com.okestro.kevin.common.exception.SessionExpiredException
import com.okestro.kevin.common.exception.UnAuthorizedException
import com.okestro.kevin.common.exception.UserNotFoundException
import com.okestro.kevin.config.jwt.JwtSupport
import com.okestro.kevin.user.domain.mapper.UserMapper
import com.okestro.kevin.user.domain.model.LoginRequest
import com.okestro.kevin.user.domain.model.TokenResponse
import com.okestro.kevin.user.service.UserService
import mu.KotlinLogging
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

/**
 * packageName  : com.okestro.kevin.user.api
 * fileName     : LoginController
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
@RestController
@RequestMapping("api", produces = ["application/vnd.react.v1+json", "application/vnd.vue.v1+json"])
class LoginController(
    val userService: UserService,
    val passwordEncoder: PasswordEncoder,
    val userMapper: UserMapper,
    val support: JwtSupport,
) {
    val log = KotlinLogging.logger {}

    @PostMapping("login")
    suspend fun login(@RequestBody request: LoginRequest) =
        userService.findByUsername(request.username)?.let { user ->
            if (!user.islogin!!) throw UnAuthorizedException("로그인 권한이 없습니다")
            if (user.isdelete!!) throw UserNotFoundException()
            if (passwordEncoder.matches(request.password, user.password)) {
                userMapper.of(user).copy(
                    atoken = support.genAccessToken(request.username),
                    rtoken = support.genRefreshToken(request.username, false)
                )
            } else {
                throw BadParameterException("ID or Password is wrong")
            }
        } ?: throw UserNotFoundException()

    @GetMapping("renew-token")
    suspend fun renewToken(@RequestParam refreshToken: String) =
        try {
            support.getUserInfo(refreshToken)?.let {
                TokenResponse(
                    atoken = support.genAccessToken(it.username),
                    rtoken = refreshToken
                )
            } ?: throw SessionExpiredException()
        } catch (e: Exception) {
            log.error { e.message }
            throw SessionExpiredException()
        }
}