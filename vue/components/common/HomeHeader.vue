<template>
   <header class="fixed top-0 inset-x-0 pr-5" style="height: 200px">
      <div class="app-bar"></div>
      <div class="fixed top-12 left-1/2 -translate-x-1/2 rounded-t-lg w-[200px]">
         <div class="border-4 border-b-[14px] border-black rounded-t-lg shadow-xlarge">
            <Icon icon="openmoji:youtube" class="text-4xl absolute left-1 top-1" />
            <video autoPlay muted loop class="object-cover">
               <source src="/videos/digital_tunnel.mp4" type="video/mp4" />
            </video>
         </div>
      </div>
      <div class="absolute w-full top-6 flex items-center justify-between px-5" :style="{ height: APPBAR_HEIGHT }">
         <div class="flex space-x-2 items-center cursor-pointer z-10">
            <Icon icon="logos:youtube-icon" class="text-3xl" />
            <span class="text-2xl font-jua">KevinTube</span>
         </div>
         <div class="flex justify-end space-x-5">
            <button @click="onLogout" class="hover:scale-125 transition-all">
               <Icon icon="line-md:logout" style="font-size: 26px" class="text-neutral-200" />
            </button>
         </div>
      </div>
   </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { APPBAR_HEIGHT } from '~/helpers/vars';
import { useSessionStore } from '~/stores/session';
import { clearToken } from '~/helpers/utils';

const router = useRouter();
const { clearMe } = useSessionStore();

const onLogout = () => {
   clearToken();
   clearMe();
   router.push('/');
};
</script>
