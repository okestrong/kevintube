'use client';

import { NextPage } from 'next';
import { PropsWithChildren, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { showError } from '@/libs/utils';
import { SenderContext } from '@/contexts/SenderProvider';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import { YOUTUBE_PLAY_URL } from '@/libs/vars';

interface Props extends PropsWithChildren {
   params: any;
}

const DetailLayout: NextPage<Props> = ({ params, children }) => {
   const query = decodeURI(params.query);
   const { id } = params;
   const { youtubeApi } = useContext(SenderContext)!;

   const { data } = useQuery<any>({
      queryKey: ['youtube', 'list', query],
      queryFn: () =>
         youtubeApi
            .get('/search', {
               params: {
                  q: query,
                  maxResults: 6,
               },
            })
            .then(res => res.data)
            .catch(showError),
      enabled: !!query,
      staleTime: Infinity,
   });

   const videos = useMemo(() => (!data ? [] : data.items.filter((v: any) => v.id.videoId !== id).slice(0, 5)), [id, data]);

   return (
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
         <div className="md:col-span-2 xl:col-span-3">{children}</div>
         <div className="col-span-1 max-h-fit shadow-medium flex flex-col items-stretch dark:bg-neutral-800 p-[10px]">
            {videos?.map((v: any) => (
               <Link href={`/youtube/search/${query}/${v.id.videoId}`} key={v.id.videoId}>
                  <div className="max-w-[330px]">
                     <ReactPlayer url={`${YOUTUBE_PLAY_URL}${v.id.videoId}`} width="100%" height="100%" />
                  </div>
                  <div className="p-8 border-b dark:border-neutral-600">{decodeURI(v.snippet.title)}</div>
               </Link>
            ))}
         </div>
      </div>
   );
};

export default DetailLayout;
