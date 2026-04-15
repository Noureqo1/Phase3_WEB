import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/upload', '/settings', '/my-videos', '/admin'];
const publicRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If already authenticated and accessing login/register, redirect to home
  if (isPublicRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // For admin routes, we would need to validate role
  // This would typically require fetching user data on the server
  if (pathname.startsWith('/admin')) {
    // Token validation happens here, role validation should happen on page level
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/upload',
    '/settings',
    '/my-videos',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
