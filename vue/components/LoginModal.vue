<template>
   <q-dialog v-model="modal" persistent>
      <q-card>
         <q-card-section class="bg-neutral-800 text-slate-300">
            <div class="text-h6">차세대 클라우드 서비스</div>
         </q-card-section>

         <q-card-section class="q-pt-none bg-neutral-800">
            <div class="flex w-[450px]">
               <div class="flex-1 flex flex-col">
                  <NuxtImg src="/images/logo_wide_white.png" alt="Logo Wide" width="250" class="my-8" />
                  <div class="flex flex-col items-center w-full">
                     <Icon icon="openmoji:youtube" style="font-size: 100px" />
                     <span class="text-4xl font-bold text-amber-500">KevinTube</span>
                  </div>
                  <form class="flex flex-col items-center space-y-8 p-4" @submit="onSubmit">
                     <form-row>
                        <form-field name="username" label="Username" placeholder="아이디를 입력하세요" autofocus autocomplete="off" maxlength="50" />
                        <span class="text-red-400">{{ errors.username }}</span>
                     </form-row>
                     <form-row>
                        <form-field type="password" name="password" label="Password" placeholder="비밀번호를 입력하세요" />
                        <span class="text-red-400">{{ errors.password }}</span>
                     </form-row>
                     <button
                        type="submit"
                        class="py-[14px] flex justify-center items-center text-white w-full rounded-sm font-bold hover:bg-orange-500 bg-indigo-500 transition-all"
                     >
                        <q-spinner v-if="isSubmitting" color="secondary" size="3em" :thickness="10" />
                        <span v-else class="text-xl font-bold">LOGIN</span>
                     </button>
                  </form>
               </div>
            </div>
         </q-card-section>
      </q-card>
      <Toaster />
   </q-dialog>
</template>

<script setup lang="ts">
import * as zod from 'zod';
import { Icon } from '@iconify/vue';
import { saveToken } from '@/helpers/utils';
import { toast } from '@/components/ui/toast';

const router = useRouter();
const { setMe } = useSessionStore();

const props = withDefaults(
   defineProps<{
      open?: boolean;
   }>(),
   {
      open: false,
   },
);

const modal = ref(props.open);

const validationSchema = toTypedSchema(
   zod.object({
      username: zod.string().min(1, { message: '로그인 아이디를 입력하세요' }),
      password: zod.string().min(1, { message: '암호를 입력하세요' }),
   }),
);
const { handleSubmit, errors, isSubmitting } = useForm({
   validationSchema,
});
const onSubmit = handleSubmit(values => {
   useFetch('/rest/login', {
      method: 'post',
      body: JSON.stringify(values),
   }).then((res: any) => {
      try {
         saveToken(res.data.value);
         setMe(res.data.value);
         router.push('/home');
      } catch (e) {
         console.error(e);
         toast({
            title: '로그인 실패',
            description: '처리중 오류가 발생했습니다',
            duration: 3000,
            variant: 'destructive',
         });
      }
   });
});
</script>
