export default defineEventHandler(event => {
   // event.context.path : pathname => '/api/foo/bar/baz'
   // event.context.params._ : 세그먼트([...]부분) => 'bar/baz'
   return 'Default foo handler';
});
