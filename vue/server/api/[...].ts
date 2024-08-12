// 404 처리용 파일
export default defineEventHandler(() => {
   throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
   });
});
