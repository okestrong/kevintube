package com.okestro.kevin.comment.service

import com.okestro.kevin.comment.domain.entity.CommentEntity
import com.okestro.kevin.comment.domain.model.CommentRequest
import com.okestro.kevin.comment.persist.CommentRepository
import com.okestro.kevin.common.exception.EntityNotFoundException
import com.okestro.kevin.common.util.CommonUtil
import com.okestro.kevin.config.handler.CommentSnitcherHandler
import org.springframework.stereotype.Service

@Service
class CommentService(
    val repository: CommentRepository
) {
    suspend fun getComments(videoId: String, page: Int, size: Int) =
        mapOf(
            "list" to repository.findAllBy(videoId, size, page * size),
            "total" to repository.countByVideoId(videoId),
            "skip" to page * size,
        )

    suspend fun createComment(request: CommentRequest) =
        repository.save(CommentEntity(request, 0, 0, 0, 0)).also {
            CommentSnitcherHandler.sink.tryEmitNext(it.videoId)
            repository.updateRef(it.id!!)
        }

    suspend fun replyComment(parentId: Long, request: CommentRequest): CommentEntity {
        val parent = repository.findById(parentId) ?: throw EntityNotFoundException("존재하지 않는 코멘트입니다")
        val lev = parent.lev
        val ref = parent.ref
        val step = parent.step
        val finalStep = repository.findNextSameLevStep(ref, lev, step)
        val newStep = repository.findNextStep(ref, (lev + 1).toShort(), finalStep)
        repository.updateNextSteps(ref, newStep)
        repository.save(parent.copy(childCnt = parent.childCnt + 1))
        return repository.save(CommentEntity(request, ref, 0, (lev + 1).toShort(), newStep))
            .let { cmt ->
                CommentSnitcherHandler.sink.tryEmitNext(cmt.videoId)
                repository.findById(cmt.id!!) ?: throw EntityNotFoundException("저장된 코멘트가 없습니다")
            }
    }

    suspend fun updateComment(id: Long, request: CommentRequest) =
        repository.findById(id)?.let {
            repository.save(CommonUtil.copyNotNullProperties(it, CommentEntity(request)))
                .let { saved ->
                    CommentSnitcherHandler.sink.tryEmitNext(saved.videoId)
                    repository.findById(saved.id!!) ?: throw EntityNotFoundException("저장된 코멘트를 찾지 못했습니다")
                }
        } ?: EntityNotFoundException("코멘트가 존재하지 않습니다")

    suspend fun deleteComment(id: Long) =
        repository.deleteCommentById(id)
}