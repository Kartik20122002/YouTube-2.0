import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { secret } from '@/utils/secrets/secrets'

export default async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret })

    if (!token) {
        const signInUrl = new URL('/api/auth/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons).*)',
    ]
}
