package com.okestro.kevin.config

import org.jasypt.encryption.StringEncryptor
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JasyptConfig {
    val secret = "yhaipXlYwNtW4SY"
    val pool = 4

    @Bean
    fun jasyptStringEncryptor(): StringEncryptor =
        PooledPBEStringEncryptor().also { encryptor ->
            encryptor.setConfig(SimpleStringPBEConfig().apply {
                password = secret
                poolSize = pool
            })
        }
}
