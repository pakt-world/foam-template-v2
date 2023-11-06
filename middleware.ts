import { NextResponse } from 'next/server';
import { AUTH_TOKEN_KEY, decodeJWTPayload } from '@/lib/utils';
import type { NextRequest } from 'next/server';

const DASHBOARD_URL = "/overview";
const AUTH_URL = "/login";

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password"
]

export function middleware(request: NextRequest) {

  const token = request.cookies.get(AUTH_TOKEN_KEY);
  if (!token) {
    if (!authRoutes.includes(request.nextUrl.pathname) && request.nextUrl.pathname != "") {
      return redirectToLogin(request);
    }
  } else {
    const payload = decodeJWTPayload(token.value);
    if (payload.exp < Date.now() / 1000) return redirectToLogin(request);
    if (authRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
    }
  }
  return NextResponse.next();
}

const redirectToLogin = (request: NextRequest) => {
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
