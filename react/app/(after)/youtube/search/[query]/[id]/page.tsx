'use client';

import { NextPage } from 'next';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import YoutubePlayer from '@/components/common/YoutubePlayer';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SenderContext } from '@/contexts/SenderProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/libs/utils';
import { z } from 'zod';
import { FieldValues, useForm } from 'react-hook-form';
import { Icon } from '@iconify-icon/react';
import { AxiosResponse } from 'axios';
import FormTextarea from '@/components/common/form/FormTextarea';
import { motion, useAnimation } from 'framer-motion';
import { useStore } from '@/libs/store';
import CommentLoadingCard from '@/app/(after)/_component/CommentLoadingCard';
import { IComment } from '@/types/common/comment-types';
import CommentCard from '@/app/(after)/_component/CommentCard';
import { PulseLoader } from 'react-spinners';
import { shakeVariants } from '@/libs/vars';

type Props = {
   params: any;
};

const DetailPage: NextPage<Props> = ({ params }) => {
   const [editingId, setEditingId] = useState(0); // 편집중인 코멘트 id
   const { id } = params;
   const query = decodeURI(params.query);
   const { youtubeApi, restApi } = useContext(SenderContext)!;
   const { me } = useStore();
   const controls = useAnimation();

   const MainSchema = useMemo(
      () =>
         z.object({
            id: z.any().optional(),
            userId: z.number().min(1),
            videoId: z.string().min(1),
            content: z.string().min(1, { message: '내용을 입력하세요' }),
         }),
      [],
   );

   const { register, control, reset, handleSubmit, setValue, setFocus } = useForm<z.infer<typeof MainSchema>>({
      mode: 'onChange',
      defaultValues: { videoId: id, userId: me?.id },
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
      queryFn: async ({ pageParam }) => {
         return restApi
            .get(`/comments/${id}?size=10&page=${pageParam || 0}`)
            .then(res => res.data)
            .catch(showError);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
         const { skip, list, total } = lastPage;
         return (skip || 0) + (list?.length || 0) < total ? pages.length : undefined;
      },
      enabled: !!id,
   });

   const { mutate: create } = useMutation({
      mutationFn: (param: FieldValues) => restApi.post('/comments', JSON.stringify(param)),
      onSuccess: (res: AxiosResponse) => {
         setValue('content', '');
         refetchComments();
      },
      onError: showError,
   });

   console.log('commentMap.pages=', commentMap?.pages);

   const comments = useMemo(
      () => commentMap?.pages?.flatMap(page => page && page.list)?.filter(cmt => !(cmt.isdelete === true && cmt.childCnt === 0)) || null,
      [commentMap],
   );

   const total: number = useMemo(() => commentMap?.pages?.[0].total || 0, [commentMap]);

   const { data: videoInfo } = useQuery<any>({
      queryKey: ['youtube', 'detail', id],
      queryFn: () =>
         youtubeApi.get('/videos', {
            params: {
               part: 'snippet',
               id,
            },
         }),
      enabled: !!id,
   });

   const { data: channelInfo } = useQuery({
      queryKey: ['youtube', 'channel', videoInfo?.data.items?.[0].snippet.channelId],
      queryFn: () =>
         youtubeApi.get('/channels', {
            params: {
               id: videoInfo.data.items[0].snippet.channelId,
            },
         }),
      enabled: !!videoInfo?.data,
   });

   const handleObserver = useCallback(
      (entries: any) => {
         const [target] = entries;
         if (target.isIntersecting && hasNextPage) {
            fetchNextPage();
         }
      },
      [fetchNextPage, hasNextPage],
   );

   useEffect(() => {
      const element = document.getElementById('scroll-end');
      const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
      if (element instanceof Element) observer.observe(element);
      return () => {
         if (element instanceof Element) observer.unobserve(element);
      };
   }, [fetchNextPage, hasNextPage, handleObserver, comments]);

   const onFocusMain = useCallback(() => {
      setFocus('content');
      controls.start('start');
      setTimeout(() => controls.stop(), 1000);
   }, []);

   const onSubmitMain = useCallback(
      (model: FieldValues) => {
         create({ ...model, userId: me?.id });
      },
      [me],
   );
   const videoDetail = useMemo(() => videoInfo?.data.items?.[0], [videoInfo]);
   const channelDetail = useMemo(() => channelInfo?.data.items?.[0], [channelInfo]);

   return (
      <div className="flex-1 flex flex-col max-w-[1200px] mx-auto">
         <div className="border-8 border-b-[26px] border-red-400 dark:border-neutral-700 relative">
            <YoutubePlayer id={id} title={query} />
            <Icon icon="logos:google-play-icon" className="text-[16px] absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-7" />
            <Icon icon="ph:power-fill" className="text-[20px] absolute right-0 bottom-0 translate-y-[21px] text-neutral-200" />
         </div>
         <span className="text-2xl font-medium mt-3">{videoDetail?.snippet.title}</span>
         <div className="flex items-center space-x-4 mt-3">
            {channelDetail && <img src={channelDetail.snippet.thumbnails.medium.url} className="rounded-full" width={40} />}
            <div className="flex flex-col">
               <span className="text-xl">{channelDetail?.snippet.title}</span>
               <span className="text-neutral-500 dark:text-neutral-400 max-w-[600px] overflow-x-hidden whitespace-nowrap text-ellipsis">
                  {channelDetail?.snippet.description}
               </span>
            </div>
         </div>
         <div className="mt-3 p-8 bg-slate-200 dark:bg-slate-700 rounded-xl whitespace-pre-wrap break-all">{videoDetail?.snippet.description}</div>
         <form onSubmit={handleSubmit(onSubmitMain)}>
            <input type="hidden" {...register('id')} />
            <input type="hidden" {...register('videoId')} />
            <input type="hidden" {...register('userId')} />
            <h4 className="debate_detail flex items-center space-x-3 mt-4">
               <Icon icon="iconamoon:comment-add-bold" className="text-2xl" />
               <span className="text-base">Comments</span>
            </h4>
            <motion.div custom={Math.floor(Math.random() * (10 - 1 + 1) + 1)} variants={shakeVariants} animate={controls} className="mt-2">
               <div className="w-full relative">
                  <FormTextarea name="content" control={control} setValue={setValue} minRows={5} mode="add" onFocus={onFocusMain} />
                  <div className="flex w-full justify-start py-3">
                     <button
                        type="submit"
                        className="border border-neutral-400 px-4 py-2 flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                     >
                        <Icon icon="carbon:send" className="text-sm" />
                        <span className="text-sm">생성</span>
                     </button>
                  </div>
               </div>
            </motion.div>
         </form>
         <div className="mt-5">
            {total === 0 ? (
               <div className="relative">
                  <Skeleton className="absolute inset-0 z-10" />
                  <div className="absolute z-20">
                     <span className="text-indigo-600 dark:text-indigo-400 font-medium text-base">첫 번째 코멘트를 생성해 보세요</span>
                     <button className="mt-2 bg-neutral-600 text-white px-4 py-2 flex items-center space-x-2 hover:bg-[#072089]" onClick={onFocusMain}>
                        Create Now
                     </button>
                  </div>
               </div>
            ) : (
               <div className="w-full flex items-center justify-center space-x-3">
                  <Icon icon="mingcute:comment-line" className="text-blue-500 text-4xl" />
                  <span className="text-lg text-neutral-600 dark:text-neutral-400">{total}개의 코멘트가 있습니다</span>
               </div>
            )}
         </div>
         <div className="mt-3 mb-12 w-full flex flex-col space-y-6">
            {commentsLoading
               ? [1, 2].map(i => <CommentLoadingCard key={i} />)
               : comments?.map((cmt: IComment) => (
                    <CommentCard
                       key={cmt?.id}
                       videoId={id}
                       comment={cmt}
                       me={me}
                       editNo={editingId}
                       setEditNo={setEditingId}
                       refetchComments={refetchComments}
                    />
                 ))}
         </div>
         {comments && comments.length > 0 && (
            <div className="w-full flex justify-center py-8" id="scroll-end">
               {isFetchingNextPage && hasNextPage ? (
                  <PulseLoader size={16} className="text-blue-500" loading />
               ) : (
                  <span className="text-sm text-neutral-500 font-medium">더 이상 코멘트가 없습니다</span>
               )}
            </div>
         )}
      </div>
   );
};

export default DetailPage;
