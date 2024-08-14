'use client';

import { NextPage } from 'next';
import { PropsWithChildren, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { showError } from '@/libs/utils';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import { YOUTUBE_PLAY_URL } from '@/libs/vars';
import axios from 'axios';
import { twMerge } from 'tailwind-merge';
import { GlobalContext } from '@/contexts/GlobalProvider';

interface Props extends PropsWithChildren {
   params: any;
}

const DetailLayout: NextPage<Props> = ({ params, children }) => {
   const query = decodeURI(params.query);
   const { isMobile } = useContext(GlobalContext)!;
   const { id } = params;

   const { data } = useQuery<any>({
      queryKey: ['youtube', 'list', query],
      queryFn: () =>
         axios
            .get(`/api/youtube/search/6`, {
               params: {
                  q: query,
               },
            })
            .then(res => res.data)
            .catch(showError),
      enabled: !!query,
      staleTime: Infinity,
   });

   const videos = useMemo(() => (!data ? [] : data.items.filter((v: any) => v.id.videoId !== id).slice(0, 5)), [id, data]);

   return (
      <div className={twMerge('mx-auto max-w-[1600px] p-8 flex items-start flex-wrap gap-8', isMobile && 'flex-col items-center')}>
         <div className="flex-1">{children}</div>
         <div className="w-full sm:w-1/2 lg:w-1/3 2xl:w-1/4 shadow-medium flex flex-col space-y-4 items-stretch dark:bg-neutral-800 p-[10px]">
            {videos?.map((v: any) => (
               <Link href={`/youtube/search/${query}/${v.id.videoId}`} key={v.id.videoId}>
                  <div className="max-w-[330px]">
                     <img src={v.snippet.thumbnails.medium.url} alt={unescape(v.snippet.title)} />
                  </div>
                  <div className="py-2 dark:border-neutral-600" dangerouslySetInnerHTML={{ __html: v.snippet.title }} />
               </Link>
            ))}
         </div>
      </div>
   );
};

export default DetailLayout;
