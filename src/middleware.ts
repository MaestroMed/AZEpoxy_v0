import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge middleware — gates every /admin/* route behind a valid session
 * cookie. The /admin/login page itself stays public so visitors can
 * authenticate. The cookie is signed/verified with ADMIN_JWT_SECRET.
 *
 * We intentionally re-implement the JWT verify here rather than import
 * src/lib/admin/auth — that file uses `server-only`, which would refuse
 * to load in the edge runtime.
 */

const COOKIE_NAME = "az_admin_session";

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login is always public.
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // Everything else under /admin requires a valid session.
  if (await isAuthed(req)) {
    return NextResponse.next();
  }

  // Not authenticated — bounce to /admin/login with a return-to.
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run only on admin routes — public site is untouched.
  matcher: ["/admin/:path*"],
};
