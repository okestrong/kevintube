import { NextRequest, NextResponse } from 'next/server';
import youtubeApi from '@/app/api/_axios/youtubeApi';

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
   const [subpath, id] = params.slug;
   const searchParams = request.nextUrl.searchParams;

   let param;
   try {
      switch (subpath) {
         case 'search':
            if (isNaN(+id)) {
               throw new Error();
            }
            param = {
               regionCode: 'KR',
               maxResults: +id,
               q: searchParams.get('q'),
               pageToken: searchParams.get('pageToken'),
            };
            break;
         case 'videos':
         case 'channels':
            param = {
               id,
            };
            break;
      }

      const res = await youtubeApi.get(`/${subpath}`, {
         params: param,
      });

      return NextResponse.json(res.data);
   } catch (e: any) {
      return NextResponse.json(
         {
            message: e.response.data.message,
         },
         {
            status: e.response.status,
         },
      );
   }
}
