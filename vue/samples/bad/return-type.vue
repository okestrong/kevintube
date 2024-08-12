<template></template>

<script setup lang="ts">
const sum = (a: number, b: number): number => a + b;

type Result = number; // sum 의 return type 을 string 으로 변경시 Result type 도 string 으로 바꿔야 한다. 실수유발.
type Params = [number, number];

const prom = Promise.resolve({
   message: 'hello',
});

type P = { message: string }; // 'hello' 를 123 으로 바꾸면 string 을 number 로 바꿔줘야 한다. 실수유발.
const p: P = { message: 'hi' };
console.log(p);
</script>
