<template>
   <div :class="twMerge('w-full relative', containerClassname)">
      <div
         :class="
            twMerge(
               'relative rounded-full w-2/3 translate-x-1/3 border border-neutral-400 py-4 px-2 dark:bg-neutral-700 transition-all duration-500',
               focused && 'shadow-neon w-full translate-x-0',
            )
         "
      >
         <input
            type="text"
            ref="searchRef"
            @keydown="onKeyDown"
            @input="onChange"
            :value="term"
            class="border-none outline-0 shadow-none w-full pl-[40px] bg-transparent"
            @focus="
               () => {
                  focused = true;
                  if (term) {
                     hasText = true;
                     show = options.length > 0;
                  }
               }
            "
            @blur="onBlur"
         />
         <Icon icon="material-symbols:search" class="text-neutral-500 dark:text-neutral-400 text-2xl absolute left-5 top-1/2 -translate-y-1/2" />
      </div>
      <ul
         v-if="show"
         ref="clickAwayTarget"
         class="max-h-[400px] bg-white dark:bg-neutral-600 border dark:border-neutral-600 mx-8 shadow-xl overflow-y-auto rounded-b-lg mt-0.5 absolute top-[54px] inset-x-8 block z-[5001]"
      >
         <li
            v-for="(it, idx) in options"
            :class="
               twMerge(
                  'border-b border-neutral-100 dark:border-neutral-600 p-4 flex justify-center items-center hover:bg-blue-300 dark:hover:bg-blue-600 hover:cursor-pointer',
                  curIdx === idx && 'bg-blue-300 dark:bg-blue-600',
               )
            "
            @click="handleSearch(it)"
         >
            {{ it }}
         </li>
      </ul>
   </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { useItemStore } from '~/stores/items';
import { onClickOutside } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';

interface Props {
   autofocus?: boolean;
   containerClassname?: string;
   defaultValue?: string;
}
const props = withDefaults(defineProps<Props>(), {
   containerClassname: '',
   defaultValue: '',
});
const clickAwayTarget = ref(null);
const focused = ref(false);
const searchRef = ref<Maybe<HTMLElement>>(null);
const hasText = ref(false);
const term = ref(props.defaultValue);
const curIdx = ref(-1);
const show = ref<boolean>(false);
const itemStore = useItemStore();
const { items } = storeToRefs(itemStore);
const { addItem } = itemStore;
const emit = defineEmits<{
   (e: 'search', term: string): void;
}>();

const options = computed(() => items.value.filter((it: string) => it.includes(term.value)) || []);

const onKeyDown = (e: KeyboardEvent) => {
   if (e.key === 'Enter' && !!term.value) {
      e.preventDefault();
      if (curIdx.value > -1) {
         const keyword = options.value[curIdx.value];
         addItem(keyword);
         emit('search', keyword);
      } else if (!e.isComposing) {
         addItem(term.value);
         emit('search', term.value);
      }
   } else if (e.key === 'Escape') {
      show.value = false;
   } else if (e.key === 'ArrowDown') {
      curIdx.value = Math.min(curIdx.value + 1, options.value.length - 1);
   } else if (e.key === 'ArrowUp') {
      curIdx.value = Math.max(curIdx.value - 1, 0);
   }
};

const onChange = (event: any) => {
   term.value = event.target.value;
   curIdx.value = -1;
};

const handleSearch = (keyword: string) => () => {
   if (term.value) {
      addItem(keyword);
      emit('search', keyword);
   }
};

const onBlur = () => setTimeout(() => (focused.value = false), 100);

onClickOutside(clickAwayTarget, () => {
   if (!focused.value) {
      show.value = false;
      curIdx.value = -1;
   }
});

watch(
   () => props.defaultValue,
   (newValue, oldValue) => {
      if (newValue && term.value !== newValue) term.value = newValue;
   },
);

watch(
   () => term.value,
   (newValue, oldValue) => {
      hasText.value = !!newValue;
   },
);

watch([hasText, options, focused], ([newHasText, newOptions, newFocused], _) => (show.value = newFocused && newHasText && newOptions.length > 0));

onMounted(() => {
   if (props.autofocus) {
      setTimeout(() => searchRef.value?.focus(), 300);
   }
});
</script>
