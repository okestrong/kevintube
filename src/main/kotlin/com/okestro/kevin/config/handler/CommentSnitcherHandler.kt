package com.okestro.kevin.config.handler

import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono
import reactor.core.publisher.Sinks
import reactor.core.scheduler.Schedulers

/**
 * packageName  : com.moaitec.wiki.config
 * fileName     : ChatWebsocketHandler
 * author       : 이재철
 * date         : 2023/07/15
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/07/15          이재철         최초 생성
 */
@Component
class CommentSnitcherHandler: WebSocketHandler {
    companion object {
        val sink = Sinks.many().multicast().directAllOrNothing<String>()
    }

    override fun handle(session: WebSocketSession): Mono<Void> {
        session.receive()
            .map { it.payloadAsText }
            .subscribeOn(Schedulers.boundedElastic())
            .subscribe { message -> sink.emitNext(message, Sinks.EmitFailureHandler.FAIL_FAST) }

        return session.send(sink.asFlux().map { msg -> session.textMessage(msg) })
    }
}