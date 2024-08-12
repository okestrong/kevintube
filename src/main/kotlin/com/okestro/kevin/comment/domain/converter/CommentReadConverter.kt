package com.okestro.kevin.comment.domain.converter

import com.okestro.kevin.comment.domain.entity.CommentEntity
import com.okestro.kevin.common.util.ConvertUtil
import io.r2dbc.spi.Row
import org.springframework.core.convert.converter.Converter

/**
 * packageName  : com.moaitec.wiki.post.converter
 * fileName     : DebateReadConverter
 * author       : 이재철
 * date         : 2023/02/09
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/02/09          이재철         최초 생성
 */
class CommentReadConverter: Converter<Row, CommentEntity> {

    // 반드시 R2dbcConfig 에 등록할 것
    override fun convert(source: Row): CommentEntity {
        return ConvertUtil.convertComment(ConvertUtil.rowToMap(source))
    }

}