import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_TOKEN_KEY } from '@/lib/utils';

const DASHBOARD_URL = '/overview';
const AUTH_URL = '/login';

const authRoutes = ['/login', '/signup', '/forgot-password', '/verify'];
const isAuthRoute = (pathName: string) => {
  let exists = false;
  for (let i = 0; i < authRoutes.length; i++) {
    const authRoute = authRoutes[i];
    pathName.includes(authRoute) ? (exists = true) : null;
  }
  return exists;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY);
  if (!token) {
    const isValidAuth = isAuthRoute(request.nextUrl.pathname);
    if (!isValidAuth && request.nextUrl.pathname != '') {
      return redirectToLogin(request);
    }
  } else {
    // const payload = decodeJWTPayload(token.value);
    // if (payload.exp < Date.now() / 1000) return redirectToLogin(request);
    if (authRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
    }
  }
  return NextResponse.next();
}

const redirectToLogin = (request: NextRequest) => {
  request.cookies.clear();
  const redirectUrl = AUTH_URL;
  return NextResponse.redirect(new URL(redirectUrl, request.url));
};

export const config = {
  matcher: [
    '/login/:path*',
    '/signup/:path*',
    '/forgot-password/:path*',
    '/overview/:path*',
    '/jobs/:path*',
    '/wallet/:path*',
    '/talents/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/projects/:path*',
    '/onboarding/:path*',
  ],
};
