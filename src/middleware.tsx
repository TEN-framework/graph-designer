// middleware.js
import { NextRequest, NextResponse } from 'next/server';


const { TEN_DEV_SERVER_URL } = process.env;

// Check if environment variables are available
if (!TEN_DEV_SERVER_URL) {
  throw "Environment variables TEN_DEV_SERVER_URL are not available";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/apix/dev-server/v1')) {
    const url = req.nextUrl.clone();
    url.href = `${TEN_DEV_SERVER_URL}${pathname.replace('/apix/dev-server/v1', '/api/dev-server/v1')}`;

    // console.log(`Rewriting request to ${url.href}`);
    return NextResponse.rewrite(url);
  }
}