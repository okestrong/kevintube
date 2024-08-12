package com.okestro.kevin.common.annotation

/**
 * packageName  : com.fast.userservice.model
 * fileName     : AuthToken
 * author       : 이재철
 * date         : 2022/11/28
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2022/11/28          이재철         최초 생성
 */
@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
annotation class AuthToken(val required: Boolean = true)
