<template>
   <div class="youtube aspect-video">
      <iframe
         :src="`https://www.youtube.com/embed/${id}`"
         width="100%"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowFullScreen
         :title="title"
      />
   </div>
</template>

<script setup lang="ts">
interface Props {
   id: string;
   title: string;
}
defineProps<Props>();
</script>

<style>
.youtube {
   width: 100%;
   overflow: hidden;
   padding-bottom: 56.25%;
   position: relative;
   height: 0;
}

.youtube > iframe {
   left: 0;
   top: 0;
   height: 100%;
   width: 100%;
   position: absolute;
}
</style>
