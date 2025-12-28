import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!!'
)

// Routes that require authentication
const protectedRoutes = ['/']

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/signin', '/signup']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value

  // Verify token
  let isAuthenticated = false
  if (token) {
    try {
      await jose.jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch (error) {
      // Token is invalid or expired
      isAuthenticated = false
    }
  }

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // Check if it's an auth route (signin/signup)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect to signin if trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect to dashboard if authenticated user tries to access auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}

