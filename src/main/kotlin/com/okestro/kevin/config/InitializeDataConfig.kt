package com.okestro.kevin.config

import com.okestro.kevin.user.domain.entity.UserEntity
import com.okestro.kevin.user.domain.model.Role
import com.okestro.kevin.user.persist.UserRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

/**
 * packageName  : com.grim.config
 * fileName     : InitializeDataConfig
 * author       : 이재철
 * date         : 2023/01/29
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/01/29          이재철         최초 생성
 */
@Component
class InitializeDataConfig(
    val userRepository: UserRepository,
    val passwordEncoder: PasswordEncoder,
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        insertUsers()
        runBlocking { launch { delay(300) } }
    }

    private fun insertUsers() =
        runBlocking {
            if (userRepository.count() == 0L) {
                userRepository.save(
                    UserEntity(
                        username = "admin",
                        password = passwordEncoder.encode("okestro"),
                        email = "admin@okestro.com",
                        name = "관리자",
                        role = Role.ADMIN,
                        islogin = true,
                        isdelete = false,
                    )
                )
                userRepository.save(
                    UserEntity(
                        username = "jclee",
                        password = passwordEncoder.encode("okestro"),
                        email = "jc.lee@okestro.com",
                        name = "이재철",
                        role = Role.USER,
                        islogin = true,
                        isdelete = false,
                    )
                )

                val list = mutableListOf<UserEntity>()

                (1..100).forEach { n ->
                    list.add(
                        UserEntity(
                            username = "user$n",
                            password = passwordEncoder.encode("okestro"),
                            email = "user$n@okestro.com",
                            name = "사용자$n",
                            role = Role.USER,
                            islogin = true,
                            isdelete = false,
                        )
                    )
                }
                list.forEach { user ->
                    userRepository.save(user)
                }
            }
        }
}