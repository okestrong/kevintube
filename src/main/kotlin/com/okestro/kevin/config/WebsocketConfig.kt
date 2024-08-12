package com.okestro.kevin.config

import com.okestro.kevin.config.handler.CommentSnitcherHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.server.support.HandshakeWebSocketService
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * packageName  : com.moaitec.wiki.config
 * fileName     : WebsocketConfig
 * author       : 이재철
 * date         : 2023/07/15
 * description  :
 * ===================================================
 * DATE                AUTHOR        NOTE
 * ---------------------------------------------------
 * 2023/07/15          이재철         최초 생성
 */
@EnableWebFlux
@Configuration
class WebsocketConfig {
    @Bean
    fun simpleUrlHandlerMapping(
        commentSnitcherHandler: CommentSnitcherHandler
    ) =
        SimpleUrlHandlerMapping().apply {
            order = 1
            urlMap = mapOf<String, WebSocketHandler>(
                "/cmt" to commentSnitcherHandler,
            )
        }

    @Bean
    fun webSocketService() =
        object : HandshakeWebSocketService() {
            override fun handleRequest(exchange: ServerWebExchange, handler: WebSocketHandler): Mono<Void> {
                return exchange.session.flatMap { /*session ->*/
                    // session.attributes["me"] = me
                    super.handleRequest(exchange, handler)
                }
            }
        }.apply {
            setSessionAttributePredicate { _ -> true }
        }

    @Bean
    fun webSocketHandlerAdapter() =
        WebSocketHandlerAdapter(webSocketService())
}