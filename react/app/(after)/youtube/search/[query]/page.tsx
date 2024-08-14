'use client';

import { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { showError } from '@/libs/utils';
import { RotatingLines } from 'react-loader-spinner';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import axios from 'axios';
import { useStore } from '@/libs/store';
import { Icon } from '@iconify-icon/react';

type Props = {
   params: { query: string };
};

const QueryPage: NextPage<Props> = ({ params }) => {
   const [pageToken, setPageToken] = useState<string>('');
   const query = useMemo(() => decodeURI(params?.query || ''), [params?.query]);
   const client = useQueryClient();
   const { lastSearchDatas, searchLock, setSearchLock, addSearchData } = useStore();
   const [ready, setReady] = useState(false);

   const { ref: endRef, inView } = useInView({
      threshold: 0,
      delay: 300,
   });

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['youtube', 'list', query],
      queryFn: () =>
         axios
            .get(`/api/youtube/search/${!pageToken || !lastSearchDatas[query] ? 5 : 3}`, {
               params: {
                  q: query,
                  ...(!!pageToken && { pageToken }),
               },
            })
            .then(res => res.data)
            .catch(showError),
      enabled: !!query && !searchLock,
      staleTime: Infinity,
   });

   useEffect(() => {
      if (data && !lastSearchDatas[query]?.some(d => d.nextPageToken === data.nextPageToken)) {
         addSearchData(query, data);
      }
      if (data?.nextPageToken && pageToken !== data.nextPageToken) {
         setPageToken(data.nextPageToken);
      } else {
         setPageToken(data?.nextPageToken);
      }
   }, [data]);

   useEffect(() => {
      setTimeout(() => setReady(true), 2500);
   }, []);

   useEffect(() => {
      if (ready && !isLoading && inView && !!pageToken) {
         setSearchLock(false);
         client.invalidateQueries({ queryKey: ['youtube', 'list', query] });
      }
   }, [inView]);

   const videos = useMemo(() => _.uniqBy(lastSearchDatas[query]?.flatMap(d => d.items) || [], o => o.id.videoId), [lastSearchDatas, query]);

   return (
      <div className="w-full flex flex-col items-center p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {videos?.map((video: any) => (
               <Link href={`/youtube/search/${query}/${video.id.videoId}`} key={video.id.videoId}>
                  <span className="rounded-lg flex flex-col">
                     <img src={video.snippet.thumbnails.medium.url} className="rounded-lg w-full" />
                     <span
                        className="text-xl mt-1 font-bold max-w-full whitespace-nowrap text-ellipsis overflow-x-hidden"
                        dangerouslySetInnerHTML={{ __html: video.snippet.title }}
                     />
                     <small className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: video.snippet.description }} />
                  </span>
               </Link>
            ))}
         </div>
         <div className="w-full flex justify-center py-4" ref={endRef}>
            {inView && !!pageToken ? (
               <RotatingLines visible width="32" animationDuration="0.75" strokeWidth="6" />
            ) : isLoading ? (
               <div className="flex flex-col items-center space-y-2">
                  <RotatingLines visible width="32" animationDuration="0.75" strokeWidth="6" />
                  <span className="text-lg text-neutral-600 font-medium">잠시만 기다려 주십시요</span>
               </div>
            ) : (
               <div className="flex flex-col items-center space-y-2">
                  <Icon icon="noto:empty-nest" style={{ fontSize: 70 }} />
                  <span className="text-lg text-neutral-600 font-medium">No more videos</span>
               </div>
            )}
         </div>
      </div>
   );
};

export default QueryPage;
