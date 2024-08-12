package com.okestro.kevin.user.persist

import com.okestro.kevin.user.domain.entity.UserEntity
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

/**
 * packageName  : com.okestro.kevin.user.persist
 * fileName     : UserRepository
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
interface UserRepository: CoroutineCrudRepository<UserEntity, Long> {
    suspend fun countByUsername(username: String): Long

    suspend fun findByUsername(username: String): UserEntity?

    suspend fun countByEmail(email: String): Long
}