package com.okestro.kevin.common.exception

import org.springframework.boot.autoconfigure.web.WebProperties
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler
import org.springframework.boot.web.reactive.error.ErrorAttributes
import org.springframework.context.ApplicationContext
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.codec.ServerCodecConfigurer
import org.springframework.stereotype.Component
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.reactive.function.server.*
import org.springframework.web.server.ServerWebInputException
import reactor.core.publisher.Mono

/**
 * packageName  : com.moaitec.wiki.common.exception
 * fileName     : ExceptionHandler
 * author       : 이재철
 * date         : 2023/02/16
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/02/16          이재철         최초 생성
 */
@Component
@Order(-2)
class ExceptionHandler(
    errorAttributes: ErrorAttributes,
    applicationContext: ApplicationContext,
    serverCodecConfigurer: ServerCodecConfigurer,
) : AbstractErrorWebExceptionHandler(
    errorAttributes, WebProperties.Resources(), applicationContext
) {
    init {
        super.setMessageReaders(serverCodecConfigurer.readers)
        super.setMessageWriters(serverCodecConfigurer.writers)
    }

    override fun getRoutingFunction(errorAttributes: ErrorAttributes?): RouterFunction<ServerResponse> =
        RouterFunctions.route(RequestPredicates.all(), this::handleError)

    fun handleError(request: ServerRequest): Mono<ServerResponse> {
        return when (val throwable = super.getError(request)) {
            is ServerException -> {
                ServerResponse.status(throwable.errorCode)
                    .bodyValue(ErrorResponse(throwable.errorCode, throwable.message))
            }

            is ServerWebInputException -> {
                ServerResponse.status(400)
                    .bodyValue(ErrorResponse(400, throwable.message))
            }

            is AccessDeniedException -> {
                ServerResponse.status(403)
                    .bodyValue(ErrorResponse(403, throwable.message.toString()))
            }

            is MethodArgumentNotValidException -> {
                val errors = mutableMapOf<String, String>()
                throwable.bindingResult.allErrors.forEach { e ->
                    errors[(e as FieldError).field] = e.defaultMessage ?: "validation error"
                }
                ServerResponse.status(HttpStatus.BAD_REQUEST)
                    .bodyValue(errors)
            }

            else -> {
                ServerResponse.status(500)
                    .bodyValue(ErrorResponse(500, throwable.message.toString()))
            }
        }
    }


}