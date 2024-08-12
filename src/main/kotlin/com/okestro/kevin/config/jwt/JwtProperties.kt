package com.okestro.kevin.config.jwt

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * packageName  : com.kevin.common.util
 * fileName     : JwtProperties
 * author       : 이재철
 * date         : 2024. 5. 11.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 5. 11.          이재철         최초 생성
 */
@ConfigurationProperties(prefix = "jwt")
data class JwtProperties(
    val issuer: String,
    val secret: String,
    val accessTime: Long,
    val refreshTime: Long,
)
