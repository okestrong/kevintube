<template>
   <div class="w-full h-screen flex flex-col items-center justify-center paper relative">
      <div class="ocean">
         <div class="wave" />
         <div class="wave" />
      </div>
   </div>
   <div class="w-[400px] lg:w-[600px] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <AutoCompleteInput autofocus @search="onSearch" />
   </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import AutoCompleteInput from '~/components/common/AutoCompleteInput.vue';

const router = useRouter();
const onSearch = (term: string) => router.push(`/youtube/search/${term}`);

definePageMeta({
   layout: 'home',
});
</script>
<style scoped>
.paper {
   background: radial-gradient(ellipse at center, rgba(255, 254, 234, 1) 0%, rgba(255, 254, 234, 1) 35%, #b7e8eb 100%);
   overflow: hidden;
   z-index: -1;
}
/* Wave */
.ocean {
   height: 5%;
   width: 100%;
   position: absolute;
   bottom: -10px;
   left: 0;
   background: transparent;
}
.wave {
   background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;
   position: absolute;
   top: -198px;
   width: 6400px;
   height: 198px;
   animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
   transform: translate3d(0, 0, 0);
}
.wave:nth-of-type(2) {
   top: -175px;
   animation:
      wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite,
      swell 7s ease -1.25s infinite;
   opacity: 1;
}

@keyframes wave {
   0% {
      margin-left: 0;
   }
   100% {
      margin-left: -1600px;
   }
}

@keyframes swell {
   0%,
   100% {
      transform: translate3d(0, -25px, 0);
   }
   50% {
      transform: translate3d(0, 5px, 0);
   }
}
</style>
