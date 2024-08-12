package com.okestro.kevin.config

import com.okestro.kevin.config.jwt.JwtArgumentResolver
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.WebFluxConfigurer
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer

/**
 * packageName  : com.fast.userservice.config
 * fileName     : WebConfig
 * author       : 이재철
 * date         : 2022/11/27
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2022/11/27          이재철         최초 생성
 */
@Configuration
class WebConfig(
    private val resolver: JwtArgumentResolver,
): WebFluxConfigurer {
    override fun configureArgumentResolvers(configurer: ArgumentResolverConfigurer) {
        super.configureArgumentResolvers(configurer)
        configurer.addCustomResolver(resolver)
    }
}