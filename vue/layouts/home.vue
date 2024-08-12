<template>
   <div class="h-screen overflow-hidden">
      <HomeHeader />
      <div class="inner" :style="{ 'min-height': `calc(100vh - ${APPBAR_HEIGHT}px`, 'margin-top': `${APPBAR_HEIGHT}px` }">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { APPBAR_HEIGHT } from '~/helpers/vars';
import HomeHeader from '~/components/common/HomeHeader.vue';
import Colors from '~/helpers/color';

const bgColor = Colors.blue[400];
const bgGradient = `linear-gradient(to right, ${Colors.teal[400]}, #015871)`;
</script>

<style>
.app-bar {
   position: relative;
   top: 0;
   width: 100vw;
   height: 200px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   overflow: hidden;
}
.app-bar:before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   width: 100%;
   background: v-bind(bgColor); /* fallback for old browsers */
   background: v-bind(bgGradient); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
   border-radius: 0 0 50% 50%/0 0 100% 100%;
   transform: scaleX(1.5);
}
</style>
