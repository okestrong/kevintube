'use client';

import { Dispatch, FC, SetStateAction, useCallback, useContext, useMemo } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoWide from '@images/logo_wide.png';
import AboutImg from '@images/cmp.png';
import LogoImg from '@images/logo_white.png';
import LogoWideDark from '@images/logo_wide_white.png';
import { AnimatePresence, motion } from 'framer-motion';
import { GlobalContext } from '@/contexts/GlobalProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormRow from '@/components/common/form/FormRow';
import MuiTextField from '@/components/common/form/MuiTextField';
import ErrorLabel from '@/components/common/form/ErrorLabel';
import { RotatingLines } from 'react-loader-spinner';
import { twMerge } from 'tailwind-merge';
import { useStore } from '@/libs/store';
import { saveToken } from '@/libs/utils';
import { Icon } from '@iconify-icon/react';
import tokenApi from '@/libs/tokenApi';
import Colors from '@/libs/color';

interface LoginModalProps {
   open: boolean;
   setOpen?: Dispatch<SetStateAction<boolean>>;
}

const LoginModal: FC<LoginModalProps> = ({ open, setOpen }) => {
   const router = useRouter();
   const { isDark } = useContext(GlobalContext)!;
   const { setMe } = useStore();

   const FormSchema = useMemo(
      () =>
         z.object({
            username: z.string().trim(),
            password: z.string().trim(),
         }),
      [],
   );

   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<z.infer<typeof FormSchema>>({
      mode: 'onChange',
      resolver: zodResolver(FormSchema),
   });

   const { mutate: login, isPending } = useMutation({
      mutationKey: ['login'],
      mutationFn: (model: FieldValues) => tokenApi.post('/login', model),
      onSuccess: res => {
         if (res.status === 200) {
            saveToken(res);
            setMe(res.data);
            router.push('/home');
         }
      },
      onError: (error: AxiosError) => {
         const res = error.response?.data as any;
         if (res && 'message' in res) {
            toast(res.message);
         }
      },
   });

   const onLogin = useCallback((model: FieldValues) => login(model), []);

   return (
      <Dialog open={open}>
         <DialogContent hideClose className="min-w-[850px] border-none outline-none">
            <DialogHeader>
               <DialogTitle className="absolute text-neutral-600 dark:text-neutral-400 font-jua text-sm mb-4">차세대 클라우드 서비스</DialogTitle>
            </DialogHeader>
            <div className="min-w-[700px] flex">
               <div className="w-[475px] flex flex-col">
                  <Image src={isDark ? LogoWideDark : LogoWide} alt="Logo Wide" width={250} className="my-8" />
                  <div className="flex flex-col items-center w-full">
                     <Icon icon="openmoji:youtube" style={{ fontSize: 100 }} />
                     <span className="text-4xl font-dohyun">Kevintube</span>
                  </div>
                  <AnimatePresence>
                     {open && (
                        <motion.form
                           key="f"
                           initial={{ opacity: 0, scale: 0.2, y: '30%' }} // slideDown 시 천천히 나타나지 않고, 갑자기 확장되는 문제 방지를 위해 주석처리함.
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ scale: 0 }}
                           transition={{ duration: 0.8 }}
                           onSubmit={handleSubmit(onLogin)}
                           className="flex flex-col items-center space-y-8 p-4"
                        >
                           <FormRow>
                              <Controller
                                 render={props => (
                                    <MuiTextField
                                       type="text"
                                       name="username"
                                       style="outline"
                                       label="Username"
                                       autoComplete="off"
                                       autoFocus
                                       onChange={props.field.onChange}
                                       maxLength={50}
                                    />
                                 )}
                                 name="username"
                                 control={control}
                              />
                              <ErrorLabel label={errors.username?.message} formLabelWidth={4} />
                           </FormRow>
                           <FormRow>
                              <Controller
                                 render={props => (
                                    <MuiTextField
                                       type="password"
                                       name="password"
                                       style="outline"
                                       label="Password"
                                       onChange={props.field.onChange}
                                       maxLength={50}
                                    />
                                 )}
                                 name="password"
                                 control={control}
                              />
                              <ErrorLabel label={errors.password?.message} formLabelWidth={4} />
                           </FormRow>
                           <button
                              type="submit"
                              className="flex items-center justify-center py-[14px] border-2 border-indigo-600 text-white w-full rounded-sm font-bold hover:bg-orange-500 bg-indigo-500 transition-all"
                           >
                              {isPending ? (
                                 <RotatingLines visible width="20" animationDuration="0.75" strokeWidth="4" strokeColor={Colors.white} />
                              ) : (
                                 <span className="text-2xl font-medium">LOGIN</span>
                              )}
                           </button>
                        </motion.form>
                     )}
                  </AnimatePresence>
               </div>
               <div className="bg-gradient-to-br from-yellow-500 to-amber-600 absolute inset-y-0 right-0 w-[40%] p-10">
                  <AnimatePresence>
                     <motion.div className="flex flex-col items-center justify-between h-full" key="g">
                        <Image src={AboutImg} alt="About Image" width={150} className="rounded-b-xl" />
                        <div className="flex flex-col items-start w-full font-poppins relative">
                           <Image src={LogoImg} alt="About Image" width={80} className="absolute -right-2 -top-8" />
                           <span
                              className={twMerge(
                                 'text-blue-500 font-black text-[2.5rem] relative',
                                 "before:content-['OKESTRO_Misson'] before:text-lg before:font-light before:text-blue-500 before:-top-[8px] before:left-0 before:absolute",
                              )}
                           >
                              CONNECT
                           </span>
                           <span
                              className={twMerge(
                                 'text-sky-700 font-black text-[2.7rem] relative -mt-4',
                                 "before:content-['OKESTRO_Identity'] before:text-base before:font-light before:text-sky-800 before:-top-[8px] before:right-0 before:absolute",
                              )}
                           >
                              BEYOND CLOUD
                           </span>
                        </div>
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default LoginModal;
