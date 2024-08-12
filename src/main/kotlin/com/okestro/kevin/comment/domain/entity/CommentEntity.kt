package com.okestro.kevin.comment.domain.entity

import com.okestro.kevin.comment.domain.model.CommentRequest
import com.okestro.kevin.user.domain.entity.UserEntity
import org.springframework.data.annotation.*
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("comments")
data class CommentEntity(
    @Id val id: Long? = null,
    @Column val userId: Long,
    @Column val videoId: String,
    @Column val content: String,
    @Column @CreatedDate val createdAt: LocalDateTime? = null,
    @Column @LastModifiedDate val updatedAt: LocalDateTime? = null,
    @Column val deletedAt: LocalDateTime? = null,
    @Column val isdelete: Boolean,
    @Column val ref: Long,
    @Column val childCnt: Int,
    @Column val lev: Short,
    @Column val step: Int,

    @Transient @ReadOnlyProperty val user: UserEntity? = null,
) {
    companion object {
        operator fun invoke(request: CommentRequest, ref: Long, childCnt: Int, lev: Short, step: Int) = request.run {
            CommentEntity(
                userId = userId,
                videoId = videoId,
                content = content,
                isdelete = false,
                ref = ref,
                childCnt = childCnt,
                lev = lev,
                step = step,
            )
        }

        operator fun invoke(request: CommentRequest) = request.run {
            CommentEntity(
                userId = userId,
                videoId = videoId,
                content = content,
                isdelete = false,
                ref = ref!!,
                childCnt = childCnt!!,
                lev = lev!!,
                step = step!!,
            )
        }
    }
}
