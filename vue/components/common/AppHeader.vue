<template>
   <header
      class="fixed bg-white dark:bg-neutral-800 top-0 inset-x-0 px-5 flex items-center justify-between border-b border-neutral-300 dark:border-neutral-500 shadow-md z-50"
      :style="{ height: `${APPBAR_HEIGHT}px` }"
   >
      <div class="flex space-x-3 items-center cursor-pointer z-10" @click="gotoHome">
         <Icon icon="logos:youtube-icon" class="text-3xl" />
         <span class="text-3xl font-jua">KevinTube</span>
      </div>
      <div class="flex justify-end space-x-5">
         <div v-if="me?.id" class="flex flex-col items-center">
            <img :src="gravatar.url(me!.email, { s: '30px', d: 'wavatar' })" :width="30" class="rounded-full" />
            <span class="font-pen">{{ me!.name }}</span>
         </div>
         <button @click="onLogout" class="hover:scale-125 transition-all">
            <Icon icon="line-md:logout" style="font-size: 24px" class="text-neutral-500 dark:text-neutral-100" />
         </button>
      </div>
      <div class="fixed top-4 left-1/2 -translate-x-1/2 w-[400px] lg:w-[600px]">
         <AutoCompleteInput @search="onSearch" :defaultValue="query" />
      </div>
   </header>
</template>

<script setup lang="ts">
import gravatar from 'gravatar';
import { APPBAR_HEIGHT } from '~/helpers/vars';
import { Icon } from '@iconify/vue';
import AutoCompleteInput from '~/components/common/AutoCompleteInput.vue';
import { clearToken } from '~/helpers/utils';

const router = useRouter();
const route = useRoute();
const [q] = route.params.slug || [];
const query = computed(() => decodeURIComponent(q || ''));

const sessionStore = useSessionStore();
const { me } = storeToRefs(sessionStore);
const { clearMe } = sessionStore;

const onLogout = () => {
   clearToken();
   clearMe();
   router.push('/');
};

const gotoHome = () => router.push('/home');

const onSearch = (term: string) => router.push(`/youtube/search/${term}`);
</script>
