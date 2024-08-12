<template>
   <div>Hello</div>
</template>

<script setup lang="ts">
const props = defineProps({
   colSpan: { type: Array as PropType<('lg:2' | '2xl:2' | '2xl:3')[] | 'full'>, default: 'full' },
   classNames: { type: String, required: true },
});
</script>
