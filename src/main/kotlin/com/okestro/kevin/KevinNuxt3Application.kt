package com.okestro.kevin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing

@SpringBootApplication
@EnableR2dbcAuditing
@ConfigurationPropertiesScan
class KevinNuxt3Application

fun main(args: Array<String>) {
    runApplication<KevinNuxt3Application>(*args)
}
