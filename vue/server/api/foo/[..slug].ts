// 'http://localhost:3000/api/foo/bar/baz'
// 'http://localhost:3000/api/foo/wow/awesome'

export default defineEventHandler(event => {
   // event.context.path : '/api/foo/bar/baz'
   // event.context.params.slug : 'bar/baz'
   return 'Hello Foo Bar';
});
