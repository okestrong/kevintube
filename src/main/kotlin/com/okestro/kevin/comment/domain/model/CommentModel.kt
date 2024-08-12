package com.okestro.kevin.comment.domain.model

data class CommentRequest(
    val userId: Long,
    val videoId: String,
    val content: String,
    val ref: Long? = null,
    val childCnt: Int? = null,
    val lev: Short? = null,
    val step: Int? = null,
)
