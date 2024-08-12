<template>
   <div class="w-full h-full flex items-center justify-center bg-[url(/images/cmp_bg.jpg)] bg-cover bg-center">
      <div class="grid grid-cols-1 xl:grid-cols-2 font-poppins w-full">
         <section class="col-span-1 flex flex-col justify-center items-center px-8">
            <div class="flex flex-col">
               <span class="font-sans text-neutral-100 font-semibold text-xl">클라우드를 클라우드 답게, 멀티 클라우드 동영상 서비스의 시작</span>
               <span class="text-7xl text-sky-500 font-black mt-8">KEVINTUBE</span>
               <span class="text-6xl text-sky-500 font-light">KEVIN VIDIEO FLATFORM</span>
               <span class="text-neutral-300 whitespace-pre-wrap break-words max-w-[400px] mt-8">
                  Kevintube 는 다양한 종류의 클라우드 인프라 SW를 표준화된 방식으로 통합관리하고, 대한민국 전자정부 클라우드 플랫폼의 표준 아키텍처를
                  기반으로하는 멀티 클라우드 통합관리 플랫폼 입니다.
               </span>
               <span class="text-neutral-300 break-words whitespace-pre-wrap mt-8 max-w-[400px]">
                  Kevintube는 기존 레거시 데이터센터에서 운영되던 인프라를(IaaS), 플랫폼을(PaaS), 소프트웨어(SaaS)를 플랫폼 위에서 하나의 서비스 형태로
                  사용자에게 제공하여 고객사의 클라우드 환경이 클라우드 답게 운영될 수 있도록 가치를 더하는데 목적을 두고 있습니다.
               </span>
            </div>
         </section>
         <section class="col-span-1 flex flex-col items-center">
            <NuxtImg src="public/images/cmp.png" alt="Logo" />
         </section>
      </div>
   </div>
   <Toaster />
</template>

<script setup lang="ts"></script>
