import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isAuthenticated = request.cookies.has('auth-session');

  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
