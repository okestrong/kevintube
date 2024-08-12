package com.okestro.kevin.user.domain.entity

import com.okestro.kevin.user.domain.model.Role
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

/**
 * packageName  : com.okestro.kevin.user.domain.entity
 * fileName     : UserEntity
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
@Table(name = "users")
data class UserEntity(
    @Id val id: Long? = null,
    val username: String,
    val password: String? = null,
    val email: String,
    val name: String,
    val phone: String? = null,
    val role: Role,
    val avatar: String? = null,
    val islogin: Boolean? = null,
    val isdelete: Boolean? = null,
)