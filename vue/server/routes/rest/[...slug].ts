import axios, { type AxiosResponse } from 'axios';

/**
 * front server to Spring Boot Backend API
 */
export default defineEventHandler(async event => {
   const slug = event.context.params?.slug;
   const instance = axios.create({
      baseURL: process.env.API_URL,
      headers: {
         'Content-Type': 'application/vnd.vue.v1+json',
      },
   });

   if (!slug) {
      throw createError({
         statusCode: 400,
         statusMessage: 'Requested invalid url (slug is empty)',
      });
   }

   const slugArr: string[] = slug!.split('/');

   let res: AxiosResponse;
   switch (slugArr[0]) {
      case 'login':
         // post 로 던졌을 때만 readBody 사용가능. 아니면 405 에러 던짐.
         const body = await readBody(event);
         res = await instance.post('/login', JSON.stringify(body));
         return res.data;
      case 'renew-token':
         const token = getQuery(event);
         res = await instance.get(`/renew-token`, {
            params: {
               ...getQuery(event),
            },
         });
         return res.data;
      case 'comments':
         res = await instance.get(`/comments/${slugArr[1]}`, {
            params: {
               ...getQuery(event),
            },
            headers: {
               Authorization: getHeader(event, 'authorization'),
            },
         });
         return res.data;
   }
});
