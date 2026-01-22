import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  // Proxy is now strictly for routing operations only
  // Authentication is handled client-side via AuthGuard component
  // This proxy file exists to satisfy Next.js 16 requirements
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
