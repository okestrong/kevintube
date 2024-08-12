<template>
   <div class="flex items-start flex-wrap w-full" :class="classes">
      <slot></slot>
   </div>
</template>

<script setup lang="ts">
const props = defineProps<{
   colSpan?: ('lg:2' | '2xl:2' | '2xl:3')[] | 'full';
}>();

const classes = computed(() => ({
   'lg:col-span-2 2xl:col-span-3': props.colSpan === 'full',
   '2xl:col-span-3': props.colSpan?.includes('2xl:3'),
   '2xl:col-span-2': props.colSpan?.includes('2xl:2'),
   'lg:col-span-2': props.colSpan?.includes('lg:2'),
}));
</script>
