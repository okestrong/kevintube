package com.okestro.kevin.comment.persist

import com.okestro.kevin.comment.domain.entity.CommentEntity
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.transaction.annotation.Transactional

interface CommentRepository: CoroutineCrudRepository<CommentEntity, Long> {
    @Query("""
        select 
            c.*
            , u.name as user_name, u.email as user_email, u.avatar as user_avatar, u.role as user_role
        from
            comments c
            join users u on c.user_id = u.id
        where c.video_id = :videoId
        order by c.ref desc, c.step asc
        limit :size offset :offset
    """)
    suspend fun findAllBy(videoId: String, size: Int, offset: Int): List<CommentEntity>

    @Query("""
        select 
            c.*
            , u.name as user_name, u.email as user_email, u.avatar as user_avatar, u.role as user_role
        from
            comments c
            join users u on c.user_id = u.id
        where
            c.id = :id
    """)
    override suspend fun findById(id: Long): CommentEntity?

    suspend fun countByVideoId(videoId: String): Long

    @Query("""
        update comments set ref = id where id = :id
    """)
    suspend fun updateRef(id: Long)

    @Query("""
        select coalesce(min(step), (select max(step)+ 1 from comments where ref = :ref))
        from comments c
        where ref = :ref and lev = :lev and step > :step
    """)
    suspend fun findNextSameLevStep(ref: Long, lev: Short, step: Int): Int

    @Query("""
        select coalesce(max(step), :step)
        from comments c
        where ref = :ref and lev = :lev and step < :step
    """)
    suspend fun findNextStep(ref: Long, lev: Short, finalStep: Int): Int

    @Modifying
    @Transactional
    @Query("""
        update comments
        set step = step + 1
        where ref = :ref and step >= :step
    """)
    suspend fun updateNextSteps(ref: Long, step: Int)

    @Modifying
    @Transactional
    @Query("""
        update comments
        set isdelete = true, deleted_at = current_timestamp
        where id = :id
    """)
    suspend fun deleteCommentById(id: Long): Long
}