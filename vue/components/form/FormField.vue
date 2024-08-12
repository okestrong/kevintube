<template>
   <q-input standout bg-color="primary" label-color="yellow" v-model="value" :name="name" :label="label" v-bind="$attrs" class="w-full rounded-md" />
</template>

<script setup lang="ts">
interface Props {
   name: string;
   type: string;
   label: string;
   placeholder?: string;
   [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
   type: 'text',
});

const { value, errorMessage } = useField(() => props.name);
</script>
