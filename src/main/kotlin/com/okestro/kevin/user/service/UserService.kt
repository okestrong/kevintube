package com.okestro.kevin.user.service

import com.okestro.kevin.user.persist.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * packageName  : com.okestro.kevin.user.service
 * fileName     : UserService
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
@Service
@Transactional
class UserService(
    val userRepository: UserRepository,
) {
    @Transactional(readOnly = true)
    suspend fun findByUsername(username: String) =
        userRepository.findByUsername(username)

    suspend fun getUser(id: Long) =
        userRepository.findById(id)
}