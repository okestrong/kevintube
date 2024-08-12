package com.okestro.kevin.common.exception

/**
 * packageName  : com.grim.exceptions
 * fileName     : ErrorResponse
 * author       : 이재철
 * date         : 2023/01/15
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/01/15          이재철         최초 생성
 */
data class ErrorResponse(
    val errorCode: Int,
    val message: String
)
