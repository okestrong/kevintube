package com.okestro.kevin.comment.api

import com.okestro.kevin.comment.domain.model.CommentRequest
import com.okestro.kevin.comment.service.CommentService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/comments", produces = ["application/vnd.react.v1+json", "application/vnd.vue.v1+json"])
class CommentController(
    val service: CommentService
) {
    @GetMapping("{videoId}")
    suspend fun getComments(@PathVariable videoId: String, @RequestParam size: Int, @RequestParam page: Int) =
        service.getComments(videoId, page, size)

    @PostMapping
    suspend fun createComment(@RequestBody request: CommentRequest) =
        service.createComment(request)

    @PostMapping("{id}/reply")
    suspend fun replyComment(@PathVariable("id") parentId: Long, @RequestBody request: CommentRequest) =
        service.replyComment(parentId, request)

    @PutMapping("{id}")
    suspend fun updateComment(@PathVariable id: Long, @RequestBody request: CommentRequest) =
        service.updateComment(id, request)

    @DeleteMapping("{id}")
    suspend fun delelteComment(@PathVariable id: Long) =
        service.deleteComment(id)
}