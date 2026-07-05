import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password';
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');
  const isAdminPage = pathname.startsWith('/admin');

  // 1. Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Redirect unauthenticated users to login for protected pages
  if (!token && (isProtectedPage || isAdminPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Prevent non-admins from entering admin routes
  if (token && isAdminPage && role !== 'Admin') {
    return NextResponse.redirect(new URL('/error/403', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
export default proxy;
