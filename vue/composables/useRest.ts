export default (url: string) => {
   return useFetch(url, {
      baseURL: 'https://api.example.com',
      onRequest: context => {
         const isDev = process.env.NODE_ENV === 'development';
         if (isDev) {
            // 참고: https://github.com/nuxt/framework/issues/2557#issuecomment-1003865620
            context.options.headers = new Headers(context.options.headers);
            context.options.headers.append('Authrization', 'Bearer TOKEN_FOR_DEV');
         }

         return null;
      },
   });
};
