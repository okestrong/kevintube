'use client';

import { NextPage } from 'next';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SenderContext } from '@/contexts/SenderProvider';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { showError } from '@/libs/utils';
import { RotatingLines } from 'react-loader-spinner';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import { usePathname } from 'next/navigation';

type Props = {
   params: { query: string };
};

const QueryPage: NextPage<Props> = ({ params }) => {
   const [pageToken, setPageToken] = useState<string>('');
   const query = decodeURI(params?.query || '');
   const { youtubeApi } = useContext(SenderContext)!;
   const client = useQueryClient();
   const [datas, setDatas] = useState<any[]>([]);
   const pathname = usePathname();

   const { ref: endRef, inView } = useInView({
      threshold: 0,
      delay: 0,
   });

   const { data, isLoading } = useQuery({
      queryKey: ['youtube', 'list', query],
      queryFn: () =>
         youtubeApi
            .get('/search', {
               params: {
                  q: query,
                  ...(!!pageToken && { pageToken }),
                  maxResults: !pageToken || datas.length === 0 ? 20 : 10,
               },
            })
            .then(res => res.data)
            .catch(showError),
      enabled: !!query,
      staleTime: Infinity,
   });

   useEffect(() => {
      if (data?.nextPageToken && !datas.some(d => d.nextPageToken === data.nextPageToken)) {
         setDatas(prev => prev.concat(data));
         setPageToken(data.nextPageToken);
      } else {
         setPageToken('');
      }
   }, [data]);

   useEffect(() => {
      if (inView && !!pageToken) {
         client.invalidateQueries({ queryKey: ['youtube', 'list', query] });
      }
   }, [inView]);

   useEffect(() => {
      if (pathname === '/home') {
         setDatas([]);
         setPageToken('');
      }
   }, [pathname]);

   const videos = useMemo(() => _.uniqBy(datas?.flatMap(d => d.items) || [], o => o.id.videoId), [data]);

   return (
      <div className="w-full flex flex-col items-center p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos?.map((video: any) => {
               const title = unescape(video.snippet.localized?.title || video.snippet.title);
               return (
                  <Link href={`/youtube/search/${query}/${video.id.videoId}`} key={video.id.videoId}>
                     <span className="rounded-lg flex flex-col">
                        <img src={video.snippet.thumbnails.medium.url} alt={title} className="rounded-lg w-full" />
                        <span className="text-xl mt-1 font-bold max-w-full whitespace-nowrap text-ellipsis overflow-x-hidden">{title}</span>
                        <small className="text-sm mt-2">{unescape(video.snippet.localized?.description || video.snippet.description)}</small>
                     </span>
                  </Link>
               );
            })}
         </div>
         {!!pageToken && (
            <div className="w-full flex justify-center py-4" ref={endRef}>
               {isLoading ? (
                  <RotatingLines visible width="32" animationDuration="0.75" strokeWidth="6" />
               ) : !videos?.[0] ? (
                  <span className="text-base text-red-400 font-medium">더 이상 검색결과가 없습니다</span>
               ) : (
                  <span>Load more...</span>
               )}
            </div>
         )}
      </div>
   );
};

export default QueryPage;
