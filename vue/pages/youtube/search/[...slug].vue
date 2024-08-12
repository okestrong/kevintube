<template>
   <div v-if="!id" class="w-full flex flex-col items-center p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         <NuxtLink v-for="video in videos" :to="`/youtube/search/${query}/${video.id.videoId}`" :key="video.id.videoId">
            <span class="rounded-lg flex flex-col">
               <img :src="video.snippet.thumbnails.medium.url" class="w-full rounded-lg aspect-video" />
               <span class="text-xl mt-1 font-bold max-w-full whitespace-nowrap text-ellipsis overflow-x-hidden" v-html="video.snippet.title" />
               <small class="text-sm mt-2" v-html="video.snippet.description" />
            </span>
         </NuxtLink>
      </div>
      <div class="w-full flex justify-center py-4" ref="endRef">
         <q-spinner v-if="isLoading" color="secondary" size="3em" :thickness="8" />
         <span v-else-if="!videos?.[0]" class="text-base text-red-400 font-medium">더 이상 검색결과가 없습니다</span>
         <span v-else>Load more...</span>
      </div>
   </div>

   <div v-else class="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
      <div class="md:col-span-2 xl:col-span-3">
         <div class="flex-1 flex flex-col max-w-[1200px] mx-auto">
            <div class="border-8 border-b-[28px] border-neutral-700 dark:border-neutral-700 w-full aspect-video relative">
               <YoutubePlayer :id="id" :title="query" />
               <Icon icon="logos:google-play-icon" class="z-10 text-[16px] absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-7" />
               <Icon icon="ph:power-fill" class="z-10 text-[20px] absolute right-0 bottom-0 translate-y-[23px] text-neutral-200" />
            </div>
            <span class="text-2xl font-medium mt-3" v-html="videoDetail?.snippet.title" />
            <div class="flex items-center space-x-4 mt-3" v-if="!!channelDetail">
               <img :src="channelDetail.snippet.thumbnails.medium.url" class="rounded-full" :width="40" />}
               <div class="flex flex-col">
                  <span class="text-xl" v-html="channelDetail.snippet.title" />
                  <span class="text-neutral-500 max-w-[600px] overflow-x-hidden whitespace-nowrap text-ellipsis">
                     {{ channelDetail?.snippet.description }}
                  </span>
               </div>
            </div>
            <div class="mt-3 p-8 bg-slate-200 dark:bg-slate-700 rounded-xl whitespace-pre-wrap break-all">{{ videoDetail?.snippet.description }}</div>
            <div v-if="!!comments?.[0]" class="w-full flex justify-center py-8" ref="cmtEndRef">
               <q-spinner v-if="isFetchingNextPage && hasNextPage" color="secondary" size="3em" :thickness="8" />
               <span v-else class="text-sm text-neutral-500 font-medium">더 이상 코멘트가 없습니다</span>
            </div>
         </div>
      </div>
      <div class="col-span-1 max-h-fit shadow-medium flex flex-col items-center dark:bg-neutral-800 p-4">
         <NuxtLink v-for="v in sideVideos" :to="`/youtube/search/${query}/${v.id.videoId}`" :key="v.id.videoId">
            <div class="max-w-[350px]">
               <img :src="v.snippet.thumbnails.medium.url" class="w-full rounded-lg aspect-video" />
               <!--               <YoutubePlayer :id="v.id.videoId" :title="v.snippet.title" />-->
               <!--               <video autoPlay muted loop class="object-cover">
                  <source :src="`${YOUTUBE_PLAY_URL}${v.id.videoId}`" type="video/mp4" />
               </video>-->
            </div>
            <div class="p-8 border-b dark:border-neutral-600" v-html="v.snippet.title" />
         </NuxtLink>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/vue-query';
import _ from 'lodash';
import { onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const pageToken = ref('');
const endRef = ref(null);
const cmtEndRef = ref(null);
const [q, id] = route.params.slug || [];
const { $restApi } = useNuxtApp();

if (!q) {
   throw createError({
      statusCode: 400,
      statusMessage: '검색어가 지정되지 않았습니다',
   });
}

const query = computed(() => decodeURIComponent(q));
const client = useQueryClient();
const datas = ref<any[]>([]);
const { path: pathname } = route;
let observer: any;

const {
   data,
   isLoading,
   refetch: refetchVideos,
} = useQuery<any>({
   queryKey: ['youtube', 'list', query.value],
   queryFn: () =>
      useFetch(`/youtube/search/${!pageToken.value || datas.value.length === 0 ? 20 : 10}`, {
         method: 'get',
         params: {
            q: query.value,
            ...(pageToken.value && { pageToken: pageToken.value }),
         },
      }).then(res => res.data.value),
   enabled: !!query.value,
});

const { data: videoInfo } = useQuery<any>({
   queryKey: ['youtube', 'detail', id],
   queryFn: () =>
      useFetch(`/youtube/videos/${id}`, {
         method: 'get',
         params: {
            id,
         },
      }).then(res => res.data.value),
   enabled: Boolean(id),
});

const { data: channelInfo } = useQuery({
   queryKey: ['youtube', 'channels', videoInfo.value?.items?.[0].snippet.channelId],
   queryFn: () => useFetch(`/youtube/channels/${videoInfo.value.items[0].snippet.channelId}`).then(res => res.data.value),
   enabled: Boolean(videoInfo.value),
});

const {
   data: commentMap,
   refetch: refetchComments,
   isLoading: commentsLoading,
   isFetchingNextPage,
   hasNextPage,
   fetchNextPage,
} = useInfiniteQuery({
   queryKey: ['youtube', 'comments', id],
   queryFn: ({ pageParam }) => useFetch(`/rest/comments/${id}?size=10&page=${pageParam || 0}`).then(res => res.data.value),
   initialPageParam: 0,
   getNextPageParam: (lastPage: any, pages) => {
      if (!lastPage) return undefined;
      const { skip, list, total } = lastPage;
      return skip + list.length < total ? pages.length : undefined;
   },
   enabled: !!id,
});

const videos = computed(() => _.uniqBy(datas.value?.flatMap(d => d.items) || [], o => o.id.videoId));
const sideVideos = computed(() => data.value.items.filter((v: any) => v.id.videoId !== id).slice(0, 5));
const videoDetail = computed(() => videoInfo.value?.items?.[0]);
const channelDetail = computed(() => channelInfo.value?.items?.[0]);
const comments = computed(
   () => commentMap.value?.pages?.flatMap((page: any) => page && page.list)?.filter(cmt => !(cmt?.isdelete && cmt?.childCnt === 0)) || null,
);

watch(
   () => data.value,
   (newData, _) => {
      if (!!newData?.nextPageToken && !datas.value.some(d => d.nextPageToken === newData.nextPageToken)) {
         datas.value = datas.value.concat(newData);
         pageToken.value = newData.nextPageToken;
      } else {
         pageToken.value = '';
      }
   },
);

watch(
   () => pathname,
   newPath => {
      if (newPath === '/home') {
         datas.value = [];
         pageToken.value = '';
      } else {
         refetchVideos();
      }
   },
);

onMounted(() => {
   if (!id) {
      observer = new IntersectionObserver(handleObserver, { threshold: 0 });
      if (endRef.value) observer.observe(endRef.value);
   } else {
      observer = new IntersectionObserver(handleCmtObserver, { threshold: 0 });
      if (cmtEndRef.value) observer.observe(cmtEndRef.value);
   }
});

onUnmounted(() => {
   if (!!observer && endRef.value) observer.unobserve(endRef.value);
   else if (!!observer && cmtEndRef.value) observer.unobserve(cmtEndRef.value);
});

const handleObserver = (entries: any) => {
   const [target] = entries;
   if (target.isIntersecting && !!pageToken) {
      client.invalidateQueries({ queryKey: ['youtube', 'list', query] });
   }
};
const handleCmtObserver = (entries: any) => {
   const [target] = entries;
   if (target.isIntersecting && hasNextPage) {
      fetchNextPage();
   }
};

definePageMeta({
   layout: 'after',
});
</script>
