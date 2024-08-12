<template>
   <div class="h-screen">
      <AppHeader />
      <div class="inner" :style="{ 'min-height': `calc(100vh - ${APPBAR_HEIGHT}px`, 'margin-top': `${APPBAR_HEIGHT}px` }">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { APPBAR_HEIGHT } from '~/helpers/vars';
import AppHeader from '~/components/common/AppHeader.vue';
</script>
