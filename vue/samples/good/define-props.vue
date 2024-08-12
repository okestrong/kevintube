<template>
   <div>Hello</div>
</template>

<script setup lang="ts">
// without default
const halfProps = defineProps<{
   colSpan?: ('lg:2' | '2xl:2' | '2xl:3')[] | 'full';
   classNames: string;
}>();

// with default
interface Props {
   colSpan?: ('lg:2' | '2xl:2' | '2xl:3')[] | 'full';
   classNames: string;
}
const completeProps = withDefaults(defineProps<Props>(), {
   colSpan: 'full',
});
</script>
