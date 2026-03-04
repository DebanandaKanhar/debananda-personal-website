import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = req.nextUrl.pathname === '/admin/login'

    if (isAdminRoute && !isLoginPage && !req.auth) {
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If already logged in and visiting login page, redirect to admin
    if (isLoginPage && req.auth) {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/admin/:path*'],
}
