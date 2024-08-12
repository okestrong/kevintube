package com.okestro.kevin.config

import com.okestro.kevin.comment.domain.converter.CommentReadConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.convert.CustomConversions
import org.springframework.data.r2dbc.convert.R2dbcCustomConversions
import org.springframework.data.r2dbc.dialect.DialectResolver
import org.springframework.r2dbc.core.DatabaseClient

/**
 * packageName  : com.moaitec.wiki.config
 * fileName     : R2dbcConfig
 * author       : 이재철
 * date         : 2023/02/09
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/02/09          이재철         최초 생성
 */
@Configuration
class R2dbcConfig {
    @Bean
    fun r2dbcCustomConversions(databaseClient: DatabaseClient): R2dbcCustomConversions {
        val dialect = DialectResolver.getDialect(databaseClient.connectionFactory)
        val converters = dialect.converters.toMutableList()
        converters.addAll(R2dbcCustomConversions.STORE_CONVERTERS)
        return R2dbcCustomConversions(
            CustomConversions.StoreConversions.of(dialect.simpleTypeHolder, converters),
            getCustomConverters()
        )
    }

    private fun getCustomConverters() = listOf(
        CommentReadConverter(),
    )
}