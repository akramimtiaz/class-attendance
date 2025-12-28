import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!!'
)

// Public routes that don't require authentication
const publicRoutes = ['/signin', '/signup']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value

  // Verify token
  let isAuthenticated = false
  if (token) {
    try {
      await jose.jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      // Token is invalid or expired
      isAuthenticated = false
    }
  }

  // If it's a public route (signin/signup)
  if (isPublicRoute) {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise, allow access to the public route
    return NextResponse.next()
  }

  // For all other routes (protected routes), require authentication
  if (!isAuthenticated) {
    const signInUrl = new URL('/signin', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // User is authenticated, allow access
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

