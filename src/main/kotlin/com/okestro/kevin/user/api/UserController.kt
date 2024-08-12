package com.okestro.kevin.user.api

import com.okestro.kevin.common.annotation.AuthToken
import com.okestro.kevin.user.domain.entity.UserEntity
import com.okestro.kevin.user.domain.mapper.UserMapper
import com.okestro.kevin.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * packageName  : com.okestro.kevin.user.api
 * fileName     : UserController
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
@RestController
@RequestMapping("api/users", produces = ["application/vnd.react.v1+json"])
class UserController(
    val mapper: UserMapper
) {
    @GetMapping("me")
    suspend fun getMe(@AuthToken user: UserEntity) =
        mapper.of(user)
}