// GET 만 허용
// GET 'http://localhost:3000/api/hello/[slug]'

export default defineEventHandler(event => {
   // event.context.path : '/api/hello/xxx'

   const slug = getRouterParam(event, 'slug');
   return `Hello ${slug}`;
});
