/**
 * front server to Youtube API v3
 */
import axios from 'axios';

// 'http://localhost:3000/youtube/[...slug]'

export default defineEventHandler(async event => {
   const slug = event.context.params?.slug; // 'search/20', 'videos/videoId값', 'channels/channelId값'

   if (!slug || !slug.includes('/')) {
      throw createError({
         statusCode: 400,
         statusMessage: 'Requested invalid url (slug is empty)',
      });
   }

   const slugArr: string[] = slug!.split('/');

   let params;
   switch (slugArr[0]) {
      case 'search':
         if (isNaN(+slugArr[1])) {
            return;
         }
         params = {
            part: 'snippet',
            maxResults: +slugArr[1],
            key: process.env.GOOGLE_API_KEY,
            type: 'video',
            ...getQuery(event),
         };
         break;
      case 'videos':
         params = {
            part: 'snippet',
            key: process.env.GOOGLE_API_KEY,
            id: slugArr[1],
            type: 'video',
         };
         break;
      case 'channels':
         params = {
            part: 'snippet',
            key: process.env.GOOGLE_API_KEY,
            id: slugArr[1],
         };
         break;
   }

   const response = await axios
      .get(`https://www.googleapis.com/youtube/v3/${slugArr[0]}`, {
         params,
      })
      .catch(e => console.error(e));
   return response?.data;
});
