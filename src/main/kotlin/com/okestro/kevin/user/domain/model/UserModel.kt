package com.okestro.kevin.user.domain.model

import java.time.LocalDateTime

/**
 * packageName  : com.okestro.kevin.user.domain.model
 * fileName     : UserModel
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
enum class Role {
    USER, ADMIN;

    companion object {
        operator fun invoke(name: String) = valueOf(name.uppercase())
    }
}

data class LoginRequest(
    val username: String,
    val password: String,
)

data class TokenResponse(
    val atoken: String,
    val rtoken: String,
)

data class SignupRequest(
    val username: String,
    val email: String,
    val password: String,
    val name: String,
    val phone: String? = null,
    val avatar: String? = null,
)

data class UserResponse(
    val id: Long,
    val username: String,
    val email: String,
    val name: String,
    val phone: String? = null,
    val role: Role,
    val avatar: String? = null,
    val islogin: Boolean,
    val isdelete: Boolean,
    val atoken: String? = null,
    val rtoken: String? = null
)

data class UserSession(
    val id: Long,
    val username: String,
    val role: Role,
)