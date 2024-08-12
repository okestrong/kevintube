package com.okestro.kevin.common.util

import io.r2dbc.spi.Batch
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.nio.ByteBuffer
import java.util.*
import kotlin.reflect.KParameter
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.functions
import kotlin.reflect.full.instanceParameter

object CommonUtil {
    /**
     * author: 이재철
     * instance (data class) 를 copy 한다.
     * 이때 newInstance 에서 값이 null 이 아닌 필드의 값들을 덮어쓴다.
     *
     * 예를 들어, instance.name = "홍길동", newInstance.name = "이순신" 이면, 반환되는 copy 인스턴스의 name 은 "이순신"
     * instance.nickname = "아줌마", newInstance.nickname = null 이면, 반환되는 copy 인스턴스의 nickname 은 "아줌마"
     *
     * [Kotlin Reflection 참고 문헌] https://xa1.at/copy-data-class-reflection/
     */
    fun <T> copyNotNullProperties(instance: Any, newInstance: Any): T {
        val klass = instance::class
        val newKlass = newInstance::class
        require(klass.isData) { "instance must be data class" }
        require(newKlass.isData) { "newInstance must be data class" }
        require(klass == newKlass) { "instance and newInstance must be same Class" }

        val map = mutableMapOf<String, Any>()

        newKlass.declaredMemberProperties.forEach { prop ->
            // get value of property
            val value = prop.getter.call(newInstance)
            // null 이 아니면 map 에 담아놓는다
            if (value != null) map[prop.name] = value
        }
        val copyFunc = klass.functions.single { f -> f.name == "copy" }
        val valueArgs = copyFunc.parameters
            .filter { param -> param.kind == KParameter.Kind.VALUE }
            .mapNotNull { param -> map[param.name]?.let { v -> param to v } }
        return copyFunc.callBy(
            mapOf(copyFunc.instanceParameter!! to instance) + valueArgs
        ) as T ?: error("copy didn't return a new instance")
    }

    fun batchInsert(entityTemplate: R2dbcEntityTemplate, action: (Batch) -> Unit) {
        Mono.from(entityTemplate.databaseClient.connectionFactory.create())
            .flatMap { conn ->
                val batch = conn.createBatch()
                action(batch)
                batch.execute().toMono().doFinally {
                    println("Batch insert done, Closing connection...")
                    conn.close()
                    println("Done. connection closed.")
                }
            }.subscribe()
    }

    fun shortenUUID(uuid: UUID): String {
        val buffer = ByteBuffer.allocate(16)
        buffer.putLong(uuid.mostSignificantBits)
        buffer.putLong(uuid.leastSignificantBits)
        return Base64.getEncoder().withoutPadding().encodeToString(buffer.array())
            .replace("/", "").replace(Regex("\\+"), "-")
    }
}