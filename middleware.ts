/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY } from "@/lib/utils";

const DASHBOARD_URL = "/overview";
const AUTH_URL = "/login";

const authRoutes = ["/login", "/signup", "/forgot-password", "/verify"];
const isAuthRoute = (pathName: string): boolean => {
    let exists = false;
    for (let i = 0; i < authRoutes.length; i++) {
        const authRoute = authRoutes[i];
        if (pathName.includes(authRoute as string)) {
            exists = true;
        }
    }
    return exists;
};

export function middleware(request: NextRequest): NextResponse<unknown> {
    const token = request.cookies.get(AUTH_TOKEN_KEY);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const redirectToLogin = (request: NextRequest): NextResponse<unknown> => {
        request.cookies.clear();
        const redirectUrl = AUTH_URL;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    };

    if (!token) {
        const isValidAuth = isAuthRoute(request.nextUrl.pathname);
        if (!isValidAuth && request.nextUrl.pathname !== "") {
            return redirectToLogin(request);
        }
    } else if (authRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
    }
    // const payload = decodeJWTPayload(token.value);
    // if (payload.exp < Date.now() / 1000) return redirectToLogin(request);

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login/:path*",
        "/signup/:path*",
        "/forgot-password/:path*",
        "/overview/:path*",
        "/jobs/:path*",
        "/wallet/:path*",
        "/talents/:path*",
        "/settings/:path*",
        "/messages/:path*",
        "/projects/:path*",
        "/onboarding/:path*",
    ],
};
