<template>
   <input v-model="value" :type="type" class="w-full py-8 px-4 rounded-md" placeholder="Username" v-bind="$attrs" />
   {{ errorMessage }}
</template>

<script setup lang="ts">
interface Props {
   name: string;
   type: string;
   [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
   type: 'text',
});

const { value, errorMessage } = useField(() => props.name);
</script>
