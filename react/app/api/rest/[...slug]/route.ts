import { NextRequest, NextResponse } from 'next/server';
import restApi from '@/app/api/_axios/restApi';

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
   const [subpath, id] = params.slug;

   const headers = {
      Authorization: request.headers.get('authorization'),
   };

   let res;
   try {
      switch (subpath) {
         case 'login':
            const loginBody = await request.json();

            res = await restApi.post('/login', JSON.stringify(loginBody));
            return NextResponse.json(res.data);
         case 'comments':
            const cmtBody = await request.json();
            res = await restApi.post('/comments', cmtBody, {
               headers,
            });
            return NextResponse.json(res.data);
         case 'comment-reply':
            const replyBody = await request.json();
            res = await restApi.post(`/comments/${id}/reply`, replyBody, {
               headers,
            });
            return NextResponse.json(res.data);
      }
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

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
   const [subpath, id] = params.slug;

   const headers = {
      Authorization: request.headers.get('authorization'),
   };

   let res;
   try {
      switch (subpath) {
         case 'comments':
            const updateBody = await request.json();

            res = await restApi.put(`/comments/${id}`, JSON.stringify(updateBody), {
               headers,
            });
            return NextResponse.json(res.data);
      }
   } catch (e: any) {
      return NextResponse.json(
         {
            message: e.response.data,
         },
         {
            status: e.response.status,
         },
      );
   }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
   const [subpath, id] = params.slug;
   const headers = {
      Authorization: request.headers.get('authorization'),
   };
   const { searchParams } = request.nextUrl;

   let res;
   try {
      switch (subpath) {
         case 'me':
            res = await restApi.get('/users/me', {
               headers,
            });
            return NextResponse.json(res.data);
         case 'renew-token':
            const token = request.nextUrl.searchParams.get('refreshToken');
            res = await restApi.get('/renew-token', {
               params: {
                  refreshToken: token,
               },
               headers,
            });
            return NextResponse.json(res.data);
         case 'comments':
            res = await restApi.get(`/comments/${id}`, {
               params: {
                  page: searchParams.get('page'),
                  size: searchParams.get('size'),
               },
               headers,
            });
            return NextResponse.json(res.data);
      }
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

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
   const [subpath, id] = params.slug;

   const headers = {
      Authorization: request.headers.get('authorization'),
   };

   try {
      switch (subpath) {
         case 'comments':
            await restApi.delete(`/comments/${id}`, {
               headers,
            });
            return NextResponse.next();
      }
   } catch (e: any) {
      return NextResponse.json(
         {
            message: e.response.data,
         },
         {
            status: e.response.status,
         },
      );
   }
}
