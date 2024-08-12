package com.okestro.kevin.config.jwt

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import com.okestro.kevin.common.exception.InvalidJwtTokenException
import com.okestro.kevin.common.exception.UnAuthorizedException
import com.okestro.kevin.common.exception.UserNotFoundException
import com.okestro.kevin.user.domain.model.Role
import com.okestro.kevin.user.domain.model.UserSession
import com.okestro.kevin.user.persist.UserRepository
import mu.KotlinLogging
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.*

@Component
class JwtSupport(
    val props: JwtProperties,
    val repository: UserRepository
) {
    private val log = KotlinLogging.logger { }
    private val zone: ZoneId = ZoneId.systemDefault()

    suspend fun genAccessToken(username: String): String {
        val instant = Instant.now()
        val expireTime = instant.plus(props.accessTime, ChronoUnit.MINUTES)
//        val expireTime = instant.plus(10, ChronoUnit.SECONDS)
        val user = repository.findByUsername(username) ?: throw UserNotFoundException("User not found, username = $username")

        return JWT.create()
            .withIssuer(props.issuer)
            .withSubject(username)
            .withIssuedAt(Date.from(instant.atZone(zone).toInstant()))
            .withExpiresAt(Date.from(expireTime.atZone(zone).toInstant()))
            .withClaim("role", user.role.name)
            .withClaim("id", user.id)
            .sign(Algorithm.HMAC256(props.secret))
    }

    suspend fun genRefreshToken(username: String, isRemember: Boolean? = false): String {
        val issuedAt = Instant.now()
        val expiredAt = issuedAt.plus(props.refreshTime * if(isRemember == true) 7 else 1, ChronoUnit.DAYS)
//        val expiredAt = issuedAt.plus(20, ChronoUnit.SECONDS)
        val user = repository.findByUsername(username) ?: throw UserNotFoundException("User not found of username $username")

        return JWT.create()
            .withIssuer(props.issuer)
            .withSubject(username)
            .withIssuedAt(Date.from(issuedAt.atZone(zone).toInstant()))
            .withExpiresAt(Date.from(expiredAt.atZone(zone).toInstant()))
            .withClaim("role", user.role.name)
            .withClaim("id", user.id)
            .sign(Algorithm.HMAC256(props.secret))
    }

    private fun validateAndDecode(tokenValue: String): DecodedJWT? {
        val algorithm = Algorithm.HMAC256(props.secret)
        val verifier = JWT.require(algorithm)
            .withIssuer(props.issuer)
            .build()
        return try {
            val token = tokenValue.replace(Regex("^Bearer\\s"), "")
            verifier.verify(token)
        } catch (e: Exception) {
            log.debug(ExceptionUtils.getStackTrace(e))
            throw UnAuthorizedException(e.message!!)
        }
    }

    fun isValid(token: String): Boolean {
        val verifier = JWT.require(Algorithm.HMAC256(props.secret))
            .withIssuer(props.issuer)
            .build()
        return try {
            verifier.verify(token.replace(Regex("^Bearer\\s"), ""))
            true
        } catch (e: Exception) {
            false
        }
    }

    /*suspend fun getUsername(token: String): String? =
        try {
            validateAndDecode(token)?.subject ?: throw InvalidJwtTokenException()
        } catch (e: Exception) {
            log.debug("getUsername : Invalid Token Exception\n${e.message}")
            throw e
        }

    suspend fun getUserId(token: String): Long? =
        try {
            validateAndDecode(token)?.let {
                it.claims["id"]?.asLong()
            } ?: throw InvalidJwtTokenException()
        } catch (e: Exception) {
            log.debug("getUserId : Invalid Token Exception\n${e.message}")
            throw e
        }*/

    fun getUserInfo(token: String): UserSession? =
        try {
            validateAndDecode(token)?.let {
                UserSession(
                    username = it.subject,
                    id = it.claims["id"]!!.asLong(),
                    role = Role(it.claims["role"]!!.asString())
                )
            } ?: throw InvalidJwtTokenException()
        } catch (e: Exception) {
            log.debug("getUserId : Invalid Token Exception\n${e.message}")
            throw e
        }
}

class BearerToken(val value: String) : AbstractAuthenticationToken(AuthorityUtils.NO_AUTHORITIES){
    override fun getCredentials(): Any = value // JWT 문자열을 자격 증명으로 반환하여 메서드를 재정의
    override fun getPrincipal(): Any = value // JWT 문자열을 주체로 반환하여 메서드를 재정의
}