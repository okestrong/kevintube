package com.okestro.kevin.common.exception

/**
 * packageName  : com.grim.exceptions
 * fileName     : SserverException
 * author       : 이재철
 * date         : 2023/01/15
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/01/15          이재철         최초 생성
 */
sealed class ServerException(
    val errorCode: Int,
    override val message: String,
) : RuntimeException(message)

data class UnAuthorizedException(
    override val message: String = "권한이 없습니다"
): ServerException(403, message)

data class UserNotFoundException(
    override val message: String = "사용자가 존재하지 않습니다"
): ServerException(404, message)

data class EntityNotFoundException(
    override val message: String = "엔티티가 존재하지 않습니다"
) : ServerException(404, message)

data class UserExistException(
    override val message: String = "이미 존재하는 사용자입니다"
) : ServerException(409, message)

data class InvalidJwtTokenException(
    override val message: String = "유효하지 않은 토큰입니다"
) : ServerException(401, message)

data class SessionExpiredException(
    override val message: String = "Session expired"
) : ServerException(410, message)

data class BadParameterException(
    override val message: String = "요청 정보가 잘못되었습니다"
): ServerException(400, message)

data class FileUploadException(
    override val message: String = "파일 업로드에 실패하였습니다"
): ServerException(400, message)