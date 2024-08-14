<template></template>

<script setup lang="ts">
const sum = (a: number, b: number): number => a + b;

type Result = ReturnType<typeof sum>;
type Params = Parameters<typeof sum>;

const prom = Promise.resolve({
   message: 'hello',
});

type P = Awaited<typeof prom>;
const p: P = { message: 'hi' }; // hello 를 123 으로 바꿔보자. 타입이 자동으로 number 로 바뀌어서 타입에러가 떠준다.
</script>
