package com.okestro.kevin.common.util

import com.okestro.kevin.comment.domain.entity.CommentEntity
import com.okestro.kevin.user.domain.entity.UserEntity
import com.okestro.kevin.user.domain.model.Role
import io.r2dbc.spi.Row
import java.time.LocalDateTime

/**
 * packageName  : com.moaitec.wiki.common.util
 * fileName     : CovertUtil
 * author       : 이재철
 * date         : 2023/02/09
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/02/09          이재철         최초 생성
 */
object ConvertUtil {
    fun rowToMap(source: Row): MutableMap<String, Any?> {
        val map = mutableMapOf<String, Any?>()
        source.metadata.columnMetadatas.forEach {
            map[it.name] = source[it.name] as Any?
        }
        return map
    }

    fun convertComment(source: MutableMap<String, Any?>) =
        CommentEntity(
            id = source["id"] as Long,
            content = source["content"].toString(),
            isdelete = source["isdelete"] as Boolean,
            createdAt = source["created_at"] as LocalDateTime,
            updatedAt = source["updated_at"] as LocalDateTime?,
            deletedAt = source["deleted_at"] as LocalDateTime?,
            userId = source["user_id"] as Long,
            videoId = source["video_id"].toString(),
            user = UserEntity(
                id = source["user_id"] as Long,
                name = source["user_name"].toString(),
                email = source["user_email"].toString(),
                avatar = source["user_avatar"]?.toString(),
                role = Role(source["user_role"].toString()),
                username = source["username"].toString(),
            ),
            childCnt = source["child_cnt"] as Int,
            ref = source["ref"] as Long,
            lev = source["lev"] as Short,
            step = source["step"] as Int,
        )
}