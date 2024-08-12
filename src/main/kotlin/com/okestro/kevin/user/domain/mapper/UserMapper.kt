package com.okestro.kevin.user.domain.mapper

import com.okestro.kevin.user.domain.entity.UserEntity
import com.okestro.kevin.user.domain.model.SignupRequest
import com.okestro.kevin.user.domain.model.UserResponse
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.ReportingPolicy

/**
 * packageName  : com.okestro.kevin.user.domain.mapper
 * fileName     : UserMapper
 * author       : 이재철
 * date         : 2024. 8. 6.
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2024. 8. 6.          이재철         최초 생성
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
interface UserMapper {
    @Mappings(
        Mapping(target = "role", expression = "java(com.okestro.kevin.user.domain.model.Role.USER)"),
        Mapping(target = "islogin", expression = "java(true)"),
        Mapping(target = "isdelete", expression = "java(false)"),
    )
    fun of(request: SignupRequest): UserEntity

    fun of(entity: UserEntity): UserResponse
}