export default defineNuxtRouteMiddleware((to, from) => {
   const { me } = storeToRefs(useSessionStore());
   if (!me.value?.id && to.path !== '/') {
      return navigateTo('/');
   }
   if (me.value?.id && to.path === '/') {
      return navigateTo('/home');
   }
});
