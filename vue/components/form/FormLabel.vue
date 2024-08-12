<template>
   <label
      :for="inputId"
      class="text-neutral-800 dark:text-neutral-200 font-bold form-label flex items-center bg-gradient-to-l from-transparent to-blue-50 dark:to-slate-600 dark:from-0% rounded-l-md"
   >
      <span class="overflow-hidden whitespace-nowrap text-ellipsis text-right pr-4">{label}&nbsp;:</span>
   </label>
</template>

<script setup lang="ts">
import { DEFAULT_LABEL_WIDTH } from '~/helpers/vars';

interface Props {
   label: string;
   inputId?: string;
   required?: boolean;
   maxWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
   maxWidth: DEFAULT_LABEL_WIDTH,
});
const width = `${props.maxWidth}px`;
</script>

<style scoped lang="scss">
.form-label {
   height: 34px;
   position: relative;
   white-space: nowrap;
   overflow-x: hidden;
   text-overflow: ellipsis;
   & > span {
      width: v-bind(width);
      max-width: v-bind(width);
   }
}
.form-label.required:after {
   content: '*';
   position: absolute;
   right: 4px;
   top: 2px;
   color: tomato;
}
</style>
