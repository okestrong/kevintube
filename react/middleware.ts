import { NextRequest, NextResponse, userAgent } from 'next/server';

export async function middleware(request: NextRequest) {
   const { device } = userAgent(request);
   const reqHeaders = new Headers(request.headers);
   reqHeaders.set('x-mobile', device.type as string);
   return NextResponse.next({
      request: {
         headers: reqHeaders,
      },
   });
}

export const config = {
   matcher: ['/', '/home', '/admin/:path*'],
};
